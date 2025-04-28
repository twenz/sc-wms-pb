import apiClient from '@/libs/axios';
import { ApiResponse } from '@/types/api';

interface LoginCredentials {
  email: string;
  password: string;
}

interface RegisterData {
  name: string;
  email: string;
  phone: string;
  password: string;
}

export const authService = {
  async login(credentials: LoginCredentials) {
    const response = await apiClient.post<ApiResponse>('/auth/login', credentials);
    return response.data;
  },

  async register(data: RegisterData) {
    const response = await apiClient.post<ApiResponse>('/auth/register', data);
    return response.data;
  },

  async logout() {
    const response = await apiClient.post<ApiResponse>('/auth/logout');
    return response.data;
  }
};