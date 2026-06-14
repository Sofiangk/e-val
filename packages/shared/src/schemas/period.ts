import { z } from 'zod';

export const evaluationPeriodSchema = z.object({
  id: z.number(),
  name: z.string(),
  starts_at: z.string().datetime(),
  ends_at: z.string().datetime(),
  is_open: z.boolean(),
  message: z.string().nullable(),
});

export type EvaluationPeriod = z.infer<typeof evaluationPeriodSchema>;
