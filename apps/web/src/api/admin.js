import { apiClient, unwrap } from './client';

export const adminApi = {
  // Returns the full { data, meta } envelope for pagination.
  students: (params = {}) => apiClient.get('/admin/students', { params }).then((r) => r.data),
  unapproved: () => apiClient.get('/admin/students/unapproved').then(unwrap),
  approve: (id) => apiClient.post(`/admin/students/${id}/approve`).then(unwrap),
  bulkApprove: (ids) => apiClient.post('/admin/students/bulk-approve', { ids }).then(unwrap),
  deleteStudent: (id) => apiClient.delete(`/admin/students/${id}`).then(unwrap),
  courses: () => apiClient.get('/admin/courses').then(unwrap),
  departments: () => apiClient.get('/admin/departments').then(unwrap),
};
