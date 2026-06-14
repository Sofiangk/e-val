import { apiClient, unwrap } from './client';

export const reportsApi = {
  summary: (department_id) =>
    apiClient
      .get('/admin/reports/summary', { params: department_id ? { department_id } : {} })
      .then(unwrap),

  // Returns a Blob for client-side download.
  exportFile: (format = 'csv', department_id) =>
    apiClient
      .get('/admin/reports/export', {
        params: { format, ...(department_id ? { department_id } : {}) },
        responseType: 'blob',
      })
      .then((r) => r.data),
};
