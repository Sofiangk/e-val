# E-Val API Contract

Base URL: `http://localhost:3000` (dev). All responses are wrapped:

```jsonc
// success
{ "data": <payload>, "meta"?: { "page": 1, "per_page": 25, "total": 42 } }
// error
{ "statusCode": 400, "message": "...", "errors"?: { "field": ["..."] } }
```

Auth: `Authorization: Bearer <access_token>`. A 401 means the access token is
missing/expired — the client should call `POST /auth/refresh`, then retry.

## Auth

| Method | Path             | Auth | Body | Notes |
|--------|------------------|------|------|-------|
| POST   | `/auth/register` | —    | `{ name, email, student_id, password }` | Creates an unapproved student. Returns session. |
| POST   | `/auth/login`    | —    | `{ email, password }` | Returns `{ access_token, refresh_token, role, user }`. |
| POST   | `/auth/refresh`  | —    | `{ refresh_token }` | Rotates the refresh token, returns a new session. |
| POST   | `/auth/logout`   | ✓    | `{ refresh_token? }` | Revokes the refresh token. |

Access tokens are JWTs (`JWT_ACCESS_TTL`, default 1h). Refresh tokens are opaque,
stored server-side, valid `JWT_REFRESH_TTL_DAYS` (default 30).

## Student

| Method | Path                       | Role    | Notes |
|--------|----------------------------|---------|-------|
| GET    | `/student`                 | student | Profile + enrollments + evaluation progress. |
| GET    | `/question-sections`       | any     | Sections with questions and Likert options (1..5). |
| POST   | `/student/evaluate-course` | student | `{ course_id, responses: [{ question_id, selected_value }] }`. Requires the evaluation period to be open. Replaces any prior answers for the course (idempotent). |

## Evaluation period

| Method | Path                          | Role | Notes |
|--------|-------------------------------|------|-------|
| GET    | `/evaluation-period/current`  | any  | `{ id, name, starts_at, ends_at, is_open, message }`. `is_open` computed server-side. |

## Admin — students

| Method | Path                              | Role  | Notes |
|--------|-----------------------------------|-------|-------|
| GET    | `/admin/students`                 | admin | Paginated. Query: `page`, `per_page`, `approved=true|false`. |
| GET    | `/admin/students/unapproved`      | admin | All pending students. |
| POST   | `/admin/students/:id/approve`     | admin | Approve one. |
| POST   | `/admin/students/bulk-approve`    | admin | `{ ids: number[] }`. |
| DELETE | `/admin/students/:id`             | admin | Delete a student. |

## Admin — courses & reports

| Method | Path                               | Role  | Notes |
|--------|------------------------------------|-------|-------|
| GET    | `/admin/courses`                   | admin | Courses with enrollment counts. |
| GET    | `/admin/departments`               | admin | Department list. |
| GET    | `/admin/reports/summary`           | admin | Query: `department_id`. Returns `{ term, rows, totals }`. |
| GET    | `/admin/reports/export`            | admin | Query: `department_id`, `format=csv|xlsx`. File download. |
| GET    | `/admin/course-averages/:courseId` | admin | Per-question averages for a course. |

## Conventions

- **Likert scale**: values 1..5. An unanswered question is omitted from
  `responses` (no row stored) so it never affects averages.
- **avg_score**: `AVG(selected_value)` over stored evaluations, rounded to 1
  decimal. `null` when a course has no evaluations.
- **completion %**: `evaluated_count / enrolled_count * 100`.
- **Dates**: ISO 8601.
- **Booleans**: real JSON booleans (no `0|1`).
