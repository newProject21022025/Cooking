// src/api/partnersApi.ts

// src/api/partnersApi.ts
import axios from 'axios';
import { Partner, PartnerDish } from '@/types/partner';

const API_URL = 'http://localhost:3000';

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

// import axios from 'axios';
// import { Partner, PartnerDish } from '@/types/partner';

// const API_URL = 'http://localhost:3000';

// export const api = {
//   // Партнери
//   getPartners: () => axios.get<Partner[]>(`${API_URL}/partners`),
//   createPartner: (data: Partial<Partner>) => axios.post<Partner>(`${API_URL}/partners`, data),
//   updatePartner: (id: string, data: Partial<Partner>) => axios.patch<Partner>(`${API_URL}/partners/${id}`, data),
//   deletePartner: (id: string) => axios.delete<Partner>(`${API_URL}/partners/${id}`),
//   blockPartner: (id: string) => axios.patch<Partner>(`${API_URL}/partners/${id}/block`),
//   getPartnerById: (userId: string) => axios.get<Partner>(`${API_URL}/partners/${userId}`),

//   // Страви партнера
//   getPartnerMenu: (partnerId: string) => axios.get<PartnerDish[]>(`${API_URL}/partner-dishes/menu/${partnerId}`),
//   addPartnerDish: (data: Partial<PartnerDish>) => axios.post<PartnerDish>(`${API_URL}/partner-dishes`, data),
//   updatePartnerDish: (id: string, data: Partial<PartnerDish>) => axios.patch<PartnerDish>(`${API_URL}/partner-dishes/${id}`, data),
//   deletePartnerDish: (id: string) => axios.delete<PartnerDish>(`${API_URL}/partner-dishes/${id}`),
  
// };
