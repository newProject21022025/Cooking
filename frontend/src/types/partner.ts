// src/types/partner.ts

export interface Partner {
    id: string;
    firstName: string;
    lastName: string;
    photo?: string;
    email: string;
    phoneNumber?: string;
    deliveryAddress?: string;
    role?: string;
    orderHistory?: any[];
    favorites?: any[];
    rating?: number;
    isBlocked?: boolean;
    createdAt?: string;
    password?: string;
  }
  
  export interface PartnerDish {
    id: string;
    partner_id: string;
    dish_id: number;
    price: number;
    discount?: number;
    available_portions: number;
  }
  