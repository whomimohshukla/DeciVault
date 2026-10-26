import apiClient from '../lib/axios';

export interface User {
  id: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  status: string;
  emailVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface RegisterData {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export async function register(data: RegisterData) {
  const response = await apiClient.post('/auth/register', data);
  return response.data;
}

export async function login(data: LoginData) {
  const response = await apiClient.post('/auth/login', data);
  return response.data;
}

export async function logout() {
  const response = await apiClient.post('/auth/logout');
  return response.data;
}

export async function getMe() {
  const response = await apiClient.get('/auth/me');
  return response.data;
}

export async function updateProfile(data: { firstName?: string; lastName?: string }) {
  const response = await apiClient.patch('/users/me', data);
  return response.data;
}

export async function verifyEmail(token: string) {
  const response = await apiClient.get(`/auth/verify-email?token=${token}`);
  return response.data;
}

export async function resendVerification() {
  const response = await apiClient.post('/auth/resend-verification');
  return response.data;
}
