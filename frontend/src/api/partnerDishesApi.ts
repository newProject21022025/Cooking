// src/api/partnerDishesApi.ts

import axios from "axios";
import { PartnerDish } from "../types/partner";


const BASE_URL =`${process.env.NEXT_PUBLIC_BACKEND_URL}/partner-dishes`;

export const fetchPartnerDishesApi = async (): Promise<PartnerDish[]> => {
  const response = await axios.get<PartnerDish[]>(BASE_URL);
  return response.data;
};

export const createPartnerDishApi = async (dish: PartnerDish): Promise<PartnerDish> => {
  const response = await axios.post<PartnerDish>(BASE_URL, dish);
  return response.data;
};

export const updatePartnerDishApi = async (id: string, dish: Partial<PartnerDish>): Promise<PartnerDish> => {
  const response = await axios.patch<PartnerDish>(`${BASE_URL}/${id}`, dish);
  return response.data;
};

export const deletePartnerDishApi = async (id: string): Promise<string> => {
  await axios.delete(`${BASE_URL}/${id}`);
  return id;
};
