// src/api/partnersApi.ts

import axios from 'axios';
import { Partner, PartnerDish } from '@/types/partner';

const API_URL = 'http://localhost:3000';

export const api = {
  // Партнери
  getPartners: () => axios.get<Partner[]>(`${API_URL}/partners`),
  createPartner: (data: Partial<Partner>) => axios.post<Partner>(`${API_URL}/partners`, data),
  updatePartner: (id: string, data: Partial<Partner>) => axios.patch<Partner>(`${API_URL}/partners/${id}`, data),
  deletePartner: (id: string) => axios.delete<Partner>(`${API_URL}/partners/${id}`),

  // Страви партнера
  getPartnerMenu: (partnerId: string) => axios.get<PartnerDish[]>(`${API_URL}/partner-dishes/menu/${partnerId}`),
  addPartnerDish: (data: Partial<PartnerDish>) => axios.post<PartnerDish>(`${API_URL}/partner-dishes`, data),
  updatePartnerDish: (id: string, data: Partial<PartnerDish>) => axios.patch<PartnerDish>(`${API_URL}/partner-dishes/${id}`, data),
  deletePartnerDish: (id: string) => axios.delete<PartnerDish>(`${API_URL}/partner-dishes/${id}`),
};
