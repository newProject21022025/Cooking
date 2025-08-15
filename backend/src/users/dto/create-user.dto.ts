// src/users/dto/create-user.dto.ts

import { 
  IsEmail, 
  IsNotEmpty, 
  IsOptional, 
  IsString, 
  IsArray, 
  IsEnum, 
  IsNumber,
  IsBoolean
} from 'class-validator';

export enum UserRole {
  USER = 'user',
  // PARTNER = 'partner',
  ADMIN = 'admin',
}

export class CreateUserDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsOptional()
  @IsString()
  firstName?: string;

  @IsOptional()
  @IsString()
  lastName?: string;

  @IsOptional()
  @IsString()
  phoneNumber?: string;

  @IsOptional()
  @IsString()
  deliveryAddress?: string;

  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole; 

  @IsOptional()
  @IsArray()
  favorites?: string[]; // id блюд

  @IsOptional()
  @IsArray()
  orderHistory?: {
    orderId: string;
    partnerId: string;
    date: string;
    status: 'completed' | 'cancelled' | 'pending';
  }[];

  @IsOptional()
  @IsNumber()
  averageRating?: number;

  @IsOptional()
  @IsBoolean()
  isBlocked?: boolean; // по замовчуванню false
}



