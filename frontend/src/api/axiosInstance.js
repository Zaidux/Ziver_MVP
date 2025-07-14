import axios from 'axios';

// This is the corrected line. It reads the variable from your Render environment.
const API_BASE_URL = import.meta.env.VITE_API_URL;

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
});

// This is the interceptor. It runs before every request is sent.
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('ziver_token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosInstance;
