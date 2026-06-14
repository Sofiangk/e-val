import { z } from 'zod';
import { LIKERT_MAX, LIKERT_MIN } from '../types';

// selected_value is 1..5. Unanswered questions are omitted from `responses`
// entirely (no row stored), so they never pollute averages. This resolves the
// avg_score ambiguity from the old backend.
export const evaluationResponseSchema = z.object({
  question_id: z.number().int().positive(),
  selected_value: z.number().int().min(LIKERT_MIN).max(LIKERT_MAX),
});

export const submitEvaluationSchema = z.object({
  course_id: z.number().int().positive(),
  responses: z.array(evaluationResponseSchema).min(1),
});

export type EvaluationResponse = z.infer<typeof evaluationResponseSchema>;
export type SubmitEvaluationInput = z.infer<typeof submitEvaluationSchema>;
