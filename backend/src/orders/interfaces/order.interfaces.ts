// src/orders/interfaces/order.interfaces.ts
export class Order {
    id: string; // uuid або артикул
    userId?: string;
    partnerId: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address: string;
    items: any[]; // масив замовлених товарів
    total: number;
    createdAt: Date;
  }
  
  