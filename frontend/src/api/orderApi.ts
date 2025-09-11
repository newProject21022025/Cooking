// src/api/orderApi.ts

import axios from 'axios';
import { CreateOrderDto, Order, OrderWithPartnerInfo } from '@/types/order';

const API_URL = `${process.env.NEXT_PUBLIC_BACKEND_URL}/orders`; // або повний URL до твого бекенду

export const createOrderApi = async (order: CreateOrderDto): Promise<{ success: boolean; orderNumber: string }> => {
  const response = await axios.post(API_URL, order);
  return response.data;
};

export const fetchOrdersApi = async (): Promise<Order[]> => {
  const response = await axios.get(API_URL);
  return response.data;
};

export const fetchOrderByNumberApi = async (orderNumber: string): Promise<Order> => {
  const response = await axios.get(`${API_URL}/${orderNumber}`);
  return response.data;
};

export const deleteOrderApi = async (orderNumber: string): Promise<{ success: boolean; message: string }> => {
  const response = await axios.delete(`${API_URL}/${orderNumber}`);
  return response.data;
};

export const updateOrderStatusApi = async (orderNumber: string, status: string): Promise<{ success: boolean; order: Order }> => {
  const response = await axios.patch(`${API_URL}/${orderNumber}/status`, { status });
  return response.data;
};

export const fetchOrdersByPartnerApi = async (partnerId: string): Promise<Order[]> => {
  const response = await axios.get(`${API_URL}/partner/${partnerId}`);
  return response.data;
};


export const fetchOrdersByUserApi = async (userId: string): Promise<OrderWithPartnerInfo[]> => {
  try {
    const response = await axios.get(`${API_URL}/user/${userId}`);
    // Тут важливо перевірити, що API повертає саме масив
    if (Array.isArray(response.data)) {
      return response.data as OrderWithPartnerInfo[]; // Приводимо тип, оскільки бекенд тепер повертає розширені дані
    }
    // Якщо дані не є масивом, повертаємо порожній масив або викидаємо помилку
    console.error('API-відповідь не є масивом:', response.data);
    return [];
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 404) {
      console.warn('Замовлення для цього користувача не знайдено.');
      return [];
    }
    throw error;
  }
};


