// src/orders/orders.service.ts

import { Injectable } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';

export interface OrderItem {
  partnerDishId: string;
  dishId: string;
  name: string;
  photo: string;
  price: number;
  discount?: number;
  quantity: number;
}

export interface Order {
  orderNumber: string;
  createdAt: Date;
  userId?: string;
  partnerId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  items: OrderItem[];
  totalSum: number;
  status?: string;
}

@Injectable()
export class OrdersService {
  constructor(private supabaseService: SupabaseService) {}

  private generateOrderNumber(): string {
    return `ORD-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
  }

  async createOrder(orderData: Omit<Order, 'orderNumber' | 'createdAt' | 'totalSum' | 'status'>): Promise<Order> {
    const totalSum = orderData.items.reduce((sum, item) => {
      const finalPrice = item.discount ? item.price - (item.price * item.discount) / 100 : item.price;
      return sum + finalPrice * item.quantity;
    }, 0);

    const newOrder: Order = {
      ...orderData,
      orderNumber: this.generateOrderNumber(),
      createdAt: new Date(),
      totalSum,
      status: 'created'
    };

    const { data, error } = await this.supabaseService
      .getClient()
      .from('orders')
      .insert([
        {
          order_number: newOrder.orderNumber,
          partner_id: newOrder.partnerId,
          user_id: newOrder.userId || null,
          first_name: newOrder.firstName,
          last_name: newOrder.lastName,
          email: newOrder.email,
          phone: newOrder.phone,
          address: newOrder.address,
          items: newOrder.items,
          total_sum: totalSum,
          status: 'created',
          created_at: new Date().toISOString()
        }
      ])
      .select();

    if (error) {
      console.error('Помилка при записі в Supabase:', error);
      throw new Error(`Помилка бази даних: ${error.message}`);
    }

    console.log('Успішно записано в Supabase:', data);
    return newOrder;
  }

  async getOrders(): Promise<Order[]> {
    const { data, error } = await this.supabaseService
      .getClient()
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(error.message);
    }

    return data.map(order => ({
      orderNumber: order.order_number,
      createdAt: new Date(order.created_at),
      userId: order.user_id,
      partnerId: order.partner_id,
      firstName: order.first_name,
      lastName: order.last_name,
      email: order.email,
      phone: order.phone,
      address: order.address,
      items: order.items,
      totalSum: order.total_sum,
      status: order.status
    }));
  }

  async getOrderByNumber(orderNumber: string): Promise<Order | null> {
    const { data, error } = await this.supabaseService
      .getClient()
      .from('orders')
      .select('*')
      .eq('order_number', orderNumber)
      .single();

    if (error) {
      console.error('Помилка при пошуку замовлення:', error);
      return null;
    }

    if (!data) {
      return null;
    }

    return {
      orderNumber: data.order_number,
      createdAt: new Date(data.created_at),
      userId: data.user_id,
      partnerId: data.partner_id,
      firstName: data.first_name,
      lastName: data.last_name,
      email: data.email,
      phone: data.phone,
      address: data.address,
      items: data.items,
      totalSum: data.total_sum,
      status: data.status
    };
  }

  // НОВИЙ МЕТОД: Видалення замовлення
  async deleteOrder(orderNumber: string): Promise<boolean> {
    const { error } = await this.supabaseService
      .getClient()
      .from('orders')
      .delete()
      .eq('order_number', orderNumber);

    if (error) {
      console.error('Помилка при видаленні замовлення:', error);
      throw new Error(`Помилка видалення: ${error.message}`);
    }

    console.log(`Замовлення ${orderNumber} успішно видалено`);
    return true;
  }

  // Додатковий метод: Оновлення статусу замовлення
  async updateOrderStatus(orderNumber: string, status: string): Promise<Order | null> {
    try {
      const { data, error } = await this.supabaseService
        .getClient()
        .from('orders')
        .update({
          status // оновлюємо тільки статус
        })
        .eq('order_number', orderNumber)
        .select();
  
      if (error) {
        console.error('Помилка при оновленні статусу:', error);
        throw new Error(`Помилка оновлення: ${error.message}`);
      }
  
      if (!data || data.length === 0) {
        console.warn(`Замовлення ${orderNumber} не знайдено для оновлення`);
        return null;
      }
  
      const updated = data[0];
  
      return {
        orderNumber: updated.order_number,
        createdAt: new Date(updated.created_at),
        userId: updated.user_id,
        partnerId: updated.partner_id,
        firstName: updated.first_name,
        lastName: updated.last_name,
        email: updated.email,
        phone: updated.phone,
        address: updated.address,
        items: updated.items,
        totalSum: updated.total_sum,
        status: updated.status
      };
    } catch (err: any) {
      console.error('Невідома помилка при оновленні статусу:', err);
      throw new Error(err.message || 'Помилка оновлення статусу');
    }
  }
  
  
  
  async getOrdersByPartner(partnerId: string): Promise<Order[]> {
    const { data, error } = await this.supabaseService
      .getClient()
      .from('orders')
      .select('*')
      .eq('partner_id', partnerId)
      .order('created_at', { ascending: false });
  
    if (error) throw new Error(error.message);
  
    return data.map(order => ({
      orderNumber: order.order_number,
      createdAt: new Date(order.created_at),
      userId: order.user_id,
      partnerId: order.partner_id,
      firstName: order.first_name,
      lastName: order.last_name,
      email: order.email,
      phone: order.phone,
      address: order.address,
      items: order.items,
      totalSum: order.total_sum,
      status: order.status
    }));
  }  
  async getOrdersByPartnerAndUser(partnerId: string, userId: string): Promise<Order[]> {
    const { data, error } = await this.supabaseService
      .getClient()
      .from('orders')
      .select('*')
      .eq('partner_id', partnerId)
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
  
    if (error) throw new Error(error.message);
  
    return data.map(order => ({
      orderNumber: order.order_number,
      createdAt: new Date(order.created_at),
      userId: order.user_id,
      partnerId: order.partner_id,
      firstName: order.first_name,
      lastName: order.last_name,
      email: order.email,
      phone: order.phone,
      address: order.address,
      items: typeof order.items === 'string' ? JSON.parse(order.items) : order.items,
      totalSum: order.total_sum,
      status: order.status
    }));
  }
}  