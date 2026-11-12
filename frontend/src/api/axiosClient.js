import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

const axiosClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: Attach JWT Token if available
axiosClient.interceptors.request.use(
  (config) => {
    const userInfo = localStorage.getItem('vrms_user');
    if (userInfo) {
      try {
        const parsed = JSON.parse(userInfo);
        if (parsed.token) {
          config.headers.Authorization = `Bearer ${parsed.token}`;
        }
      } catch (err) {
        console.error('Error parsing stored user info', err);
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Global Error handling
axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.message ||
      error.message ||
      'An unexpected network error occurred.';

    // If 401 and not on login page, clear token and notify
    if (error.response?.status === 401 && !window.location.pathname.includes('/login')) {
      // Token expired or invalid
      // localStorage.removeItem('vrms_user');
    }

    return Promise.reject(new Error(message));
  }
);

export default axiosClient;
