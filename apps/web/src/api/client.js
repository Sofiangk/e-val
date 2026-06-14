import axios from 'axios';

const baseURL = import.meta.env.VITE_APP_API_URL || 'http://localhost:3000';

export const apiClient = axios.create({ baseURL });

// The auth store is bound at app startup (see main.js) to avoid a circular
// import between the store and this client.
let authStore = null;
export function bindAuthStore(store) {
  authStore = store;
}

// Attach the current access token to every request.
apiClient.interceptors.request.use((config) => {
  const token = authStore?.accessToken;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// On 401, try a single transparent refresh, then retry the original request.
// If refresh fails, clear the session and bounce to login.
let refreshPromise = null;
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config;
    const status = error.response?.status;

    if (status === 401 && original && !original._retried && authStore?.refreshToken) {
      original._retried = true;
      try {
        refreshPromise = refreshPromise || authStore.refreshSession();
        await refreshPromise;
        refreshPromise = null;
        original.headers = original.headers || {};
        original.headers.Authorization = `Bearer ${authStore.accessToken}`;
        return apiClient(original);
      } catch (refreshError) {
        refreshPromise = null;
        authStore.forceLogout();
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  },
);

// Unwrap the standard { data } envelope.
export const unwrap = (response) => response.data?.data ?? response.data;
