import { apiClient, unwrap } from './client';

export const authApi = {
  login: (credentials) => apiClient.post('/auth/login', credentials).then(unwrap),
  register: (input) => apiClient.post('/auth/register', input).then(unwrap),
  refresh: (refresh_token) => apiClient.post('/auth/refresh', { refresh_token }).then(unwrap),
  logout: (refresh_token) => apiClient.post('/auth/logout', { refresh_token }).then(unwrap),
  me: () => apiClient.get('/student').then(unwrap),
  questionSections: () => apiClient.get('/question-sections').then(unwrap),
};
