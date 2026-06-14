import { apiClient, unwrap } from './client';

export const studentApi = {
  currentPeriod: () => apiClient.get('/evaluation-period/current').then(unwrap),
  evaluateCourse: (payload) =>
    apiClient.post('/student/evaluate-course', payload).then(unwrap),
};
