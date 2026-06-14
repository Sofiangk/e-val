export const ROLES = {
  STUDENT: 'student',
  ADMIN: 'admin',
} as const;

export type Role = (typeof ROLES)[keyof typeof ROLES];

// 5-point Likert scale, values 1..5 (Strongly Disagree .. Strongly Agree).
// An unanswered question is simply absent (no Evaluation row), so it never
// pollutes averages — no sentinel value needed.
export const LIKERT_MIN = 1;
export const LIKERT_MAX = 5;

export interface PaginationMeta {
  page: number;
  per_page: number;
  total: number;
}

export interface ApiResponse<T> {
  data: T;
  meta?: PaginationMeta;
}

export interface ApiErrorResponse {
  statusCode: number;
  message: string;
  errors?: Record<string, string[]>;
}
