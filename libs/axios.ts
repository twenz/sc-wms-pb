
// import { message } from 'antd';
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
    // const { message } = App.useApp()
    if (error.response) {
      // console.log("🚀 ~ error:", error.response.data)
      // Handle different status codes
      // switch (error.response.status) {
      //   case 400:
      //     error.message = ((error.response.data as { error?: string })?.error) || 'Bad Request'
      //     // message.error(((error.response.data as { error?: string })?.error) || 'Bad Request');
      //     break;
      //   case 401:
      //     error.message = 'Unauthorized access'
      //     // message.error('Unauthorized access');
      //     // Add redirect to login if needed
      //     break;
      //   case 403:
      //     error.message = 'Forbidden access'
      //     // message.error('Forbidden access');
      //     break;
      //   case 404:
      //     error.message = 'Resource not found'
      //     // message.error('Resource not found');
      //     break;
      //   case 500:
      //     error.message = 'Internal server error'
      //     // message.error('Internal server error');
      //     break;
      //   default:
      //     error.message = 'Something went wrong'
      //   // message.error('Something went wrong');
      // }
    } else if (error.request) {
      // error.message = 'Network erro'
      // message.error('Network error');
    } else {
      // error.message = 'Error setting up request'
      // message.error('Error setting up request');
    }
    return Promise.reject(error);
  }
);

export default axiosClient;