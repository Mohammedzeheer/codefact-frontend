// api/axios.js
import axios from 'axios';

// Base URLs for different services
const MAIN_SERVICE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
const STUDIO_SERVICE_URL = process.env.REACT_APP_STUDIO_URL || 'http://localhost:5001';

// Create API instances for different services 
const createApiInstance = (baseURL) => {
  const api = axios.create({
    baseURL,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  // Request Interceptor
  api.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem('accessToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  // Response Interceptor
  api.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;

      // Handle 401 Unauthorized and token refresh
      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;

        try {
          const refreshToken = localStorage.getItem('refreshToken');
          const response = await axios.post(
            `${MAIN_SERVICE_URL}/auth/refresh-token`,
            {
              refreshToken,
            }
          );

          const { accessToken } = response.data;
          localStorage.setItem('accessToken', accessToken);

          // Update token in original request
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          return api(originalRequest);
        } catch (refreshError) {
          // Handle refresh token failure
          localStorage.clear();
          window.location.href = '/login';
          return Promise.reject(refreshError);
        }
      }

      // Handle other errors
      if (error.response?.status === 404) {
        // Handle not found
        console.error('Resource not found:', error);
      }

      if (error.response?.status === 500) {
        // Handle server error
        console.error('Server error:', error);
      }

      return Promise.reject(error);
    }
  );

  return api;
};

// Create instances for different services
export const mainApi = createApiInstance(MAIN_SERVICE_URL);
export const studioApi = createApiInstance(STUDIO_SERVICE_URL);

// Usage example in your services:
export const authService = {
  login: (credentials) => mainApi.post('/auth/login', credentials),
  refreshToken: (refreshToken) => mainApi.post('/auth/refresh-token', { refreshToken }),
};

export const studioService = {
  getStudios: (filters) => studioApi.get('/', { params: filters }),
  addStudio: (studioData) => studioApi.post('/', studioData),
};
