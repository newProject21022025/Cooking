import axios from 'axios';
import { CreateOrderDto, Order } from '@/types/order';

const API_URL = 'http://localhost:3000/orders'; // або повний URL до твого бекенду

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

