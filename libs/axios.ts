import { message } from 'antd';
import axios, { AxiosError } from 'axios';

const axiosClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
axiosClient.interceptors.request.use(
  (config) => {
    // You can add auth token here
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
axiosClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error: AxiosError) => {
    if (error.response) {
      // Handle different status codes
      switch (error.response.status) {
        case 400:
          message.error(((error.response.data as { error?: string })?.error) || 'Bad Request');
          break;
        case 401:
          message.error('Unauthorized access');
          // Add redirect to login if needed
          break;
        case 403:
          message.error('Forbidden access');
          break;
        case 404:
          message.error('Resource not found');
          break;
        case 500:
          message.error('Internal server error');
          break;
        default:
          message.error('Something went wrong');
      }
    } else if (error.request) {
      message.error('Network error');
    } else {
      message.error('Error setting up request');
    }
    return Promise.reject(error);
  }
);

export default axiosClient;