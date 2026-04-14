import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080',
});

// Request interceptor — attach JWT token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor — handle 401 and 403 globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;

    if (status === 401) {
      // Token is invalid or expired — clear storage and redirect to login
      localStorage.removeItem('token');
      window.dispatchEvent(new CustomEvent('auth:unauthorized'));
    } else if (status === 403) {
      // Extract the server's message if available, otherwise use a default
      const serverMessage =
        error.response?.data?.message ||
        'You are not authorized to perform this action.';
      // Dispatch a custom event so the toast system can pick it up
      window.dispatchEvent(
        new CustomEvent('auth:forbidden', { detail: { message: serverMessage } })
      );
    }

    return Promise.reject(error);
  }
);

export default api;