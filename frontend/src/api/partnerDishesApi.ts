// src/api/partnerDishesApi.ts

import axios from "axios";

const BASE_URL =`${process.env.NEXT_PUBLIC_BACKEND_URL}/partner-dishes`;

export const fetchPartnerDishesApi = async () => {
  const response = await axios.get(BASE_URL);
  return response.data;
};

export const createPartnerDishApi = async (dish: {
  partner_id: string;
  dish_id: number;
  price: number;
  discount?: number;
  availablePortions: number;
}) => {
  const response = await axios.post(BASE_URL, dish);
  return response.data;
};

export const updatePartnerDishApi = async (id: string, dish: any) => {
  const response = await axios.patch(`${BASE_URL}/${id}`, dish);
  return response.data;
};

export const deletePartnerDishApi = async (id: string) => {
  await axios.delete(`${BASE_URL}/${id}`);
  return id;
};
