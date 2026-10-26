import axios from 'axios';

const apiBaseUrl =
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

export const apiClient = axios.create({
  baseURL: apiBaseUrl,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default apiClient;
