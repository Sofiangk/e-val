import { z } from 'zod';

export const reportRowSchema = z.object({
  course_id: z.number(),
  name: z.string(),
  course_code: z.string(),
  department_id: z.number(),
  department_name: z.string(),
  enrolled_count: z.number(),
  evaluated_count: z.number(),
  avg_score: z.number().nullable(),
});

export const reportTotalsSchema = z.object({
  courses: z.number(),
  enrolled: z.number(),
  evaluated: z.number(),
  overall_completion_pct: z.number(),
  overall_avg_score: z.number().nullable(),
});

export const reportSummarySchema = z.object({
  term: z
    .object({
      id: z.number(),
      name: z.string(),
      starts_at: z.string(),
      ends_at: z.string(),
    })
    .nullable(),
  rows: z.array(reportRowSchema),
  totals: reportTotalsSchema,
});

export type ReportRow = z.infer<typeof reportRowSchema>;
export type ReportTotals = z.infer<typeof reportTotalsSchema>;
export type ReportSummary = z.infer<typeof reportSummarySchema>;
