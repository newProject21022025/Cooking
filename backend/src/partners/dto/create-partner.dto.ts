// src/partners/dto/create-partner.dto.ts

import { IsEmail, IsNotEmpty, IsOptional, IsString, IsNumber, IsBoolean, IsEnum } from 'class-validator';

export enum PartnerRole {
  partner = 'partner',
  // ADMIN = 'admin',
}

export class CreatePartnerDto {
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @IsString()
  @IsNotEmpty()
  lastName: string;

  @IsOptional()
  @IsString()
  photo?: string;

  @IsEmail()
  email: string;

  @IsString()
  password: string;

  @IsOptional()
  @IsString()
  phoneNumber?: string;

  @IsOptional()
  @IsString()
  deliveryAddress?: string;

  @IsOptional()
  @IsEnum(PartnerRole)
  role: PartnerRole = PartnerRole.partner;  // ✅ дефолт partner

  @IsOptional()
  orderHistory?: any[];

  @IsOptional()
  favorites?: any[];

  @IsOptional()
  @IsNumber()
  rating?: number;

  @IsOptional()
  @IsBoolean()
  isBlocked: boolean = false; // ✅ дефолт false
}
