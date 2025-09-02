// src/orders/dto/create-order.dto.ts
import { IsString, IsArray, IsOptional, IsEmail } from 'class-validator';

export class OrderItemDto {
  @IsString()
  partnerDishId: string;

  @IsString()
  dishId: string;

  @IsString()
  name: string;

  @IsString()
  photo: string;

  @IsOptional()
  discount?: number;

  quantity: number;
  price: number;
}

export class CreateOrderDto {
  @IsOptional()
  @IsString()
  userId?: string; // якщо залогінений

  @IsString()
  partnerId: string;

  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsEmail()
  email: string;

  @IsString()
  phone: string;

  @IsString()
  address: string;

  @IsArray()
  items: OrderItemDto[];
}
