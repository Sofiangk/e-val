# E-Val — Course Evaluation Platform

A single-institution course evaluation app. Students complete per-course Likert
evaluations during an open window; admins approve registrations, monitor
participation, and export reports.

Monorepo managed with **pnpm workspaces** + **Turborepo**.

```
apps/
  web/        Vue 3 SPA (Vite, Pinia, Tailwind)
  api/        NestJS REST API (Prisma, JWT auth)
packages/
  shared/     Zod schemas + TS types shared by web and api
docs/
  api-contract.md   Endpoint reference
```

## Prerequisites

- Node >= 20
- pnpm 10 (`corepack enable`)

No database server needed for local dev — the API uses **SQLite**. For
production, switch the Prisma datasource to PostgreSQL (see
`apps/api/prisma/schema.prisma`).

## Setup

```bash
pnpm install                 # install all workspaces
cp apps/api/.env.example apps/api/.env
cp apps/web/.env.example apps/web/.env
pnpm --filter @e-val/shared build
pnpm --filter @e-val/api db:migrate   # creates SQLite db + runs migration
pnpm --filter @e-val/api db:seed      # seeds demo data
```

## Run

```bash
pnpm dev          # web + api together (turbo)
pnpm dev:api      # api only  → http://localhost:3000
pnpm dev:web      # web only  → http://localhost:5173
```

Seeded logins (password `password`):

| Role    | Email              |
|---------|--------------------|
| Admin   | admin@eval.local   |
| Student | omar@eval.local    |

## Scripts

| Command          | Action                                  |
|------------------|-----------------------------------------|
| `pnpm build`     | Build all packages (shared → api/web)   |
| `pnpm lint`      | Typecheck all packages                  |
| `pnpm test`      | Run tests                               |
| `pnpm db:migrate`| Run Prisma migrations (api)             |
| `pnpm db:seed`   | Seed the database (api)                 |
| `pnpm db:reset`  | Drop, migrate, and reseed (api)         |

## Frontend mock mode

The web app can serve API responses from `src/mocks` without a running backend.
Toggle with `VITE_USE_MOCKS=true` in `apps/web/.env`, or at runtime in the
browser: `localStorage.setItem('useMocks', 'true')`.

## Moving to PostgreSQL

1. In `apps/api/prisma/schema.prisma`, set `provider = "postgresql"` and
   re-add a `Role` enum (replacing the `role String` fields).
2. Change `Question.options` back to `Json`.
3. Point `DATABASE_URL` at your Postgres instance.
4. `pnpm --filter @e-val/api db:migrate`.
