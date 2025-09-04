// src/api/partnersApi.ts

import axios from 'axios';
import { Partner, PartnerDish } from '@/types/partner';

const API_URL = `${process.env.NEXT_PUBLIC_BACKEND_URL}`;

// Додаємо інтерцептор для автоматичного додавання токена
const apiClient = axios.create({
  baseURL: API_URL,
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const api = {
  // Партнери
  getPartners: () => apiClient.get<Partner[]>(`/partners`),
  getPartnerById: (id: string) => apiClient.get<Partner>(`/partners/${id}`),
  createPartner: (data: Partial<Partner>) => apiClient.post<Partner>(`/partners`, data),
  updatePartner: (id: string, data: Partial<Partner>) => apiClient.patch<Partner>(`/partners/${id}`, data),
  deletePartner: (id: string) => apiClient.delete<Partner>(`/partners/${id}`),
  blockPartner: (id: string) => apiClient.patch<Partner>(`/partners/${id}/block`),

  // Страви партнера
  getPartnerMenu: (partnerId: string) => apiClient.get<PartnerDish[]>(`/partner-dishes/menu/${partnerId}`),
  addPartnerDish: (data: Partial<PartnerDish>) => apiClient.post<PartnerDish>(`/partner-dishes`, data),
  updatePartnerDish: (id: string, data: Partial<PartnerDish>) => apiClient.patch<PartnerDish>(`/partner-dishes/${id}`, data),
  deletePartnerDish: (id: string) => apiClient.delete<PartnerDish>(`/partner-dishes/${id}`),
};
