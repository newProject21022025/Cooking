// src/partners/dto/create-partner.dto.ts

import { IsEmail, IsNotEmpty, IsOptional, IsString, IsNumber, IsBoolean, IsEnum, IsObject } from 'class-validator';

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
  avatar?: string;

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

  // ✅ Додаємо нове поле "description"
  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsEnum(PartnerRole)
  role: PartnerRole = PartnerRole.partner; // ✅ дефолт partner

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

  @IsOptional()
  @IsObject()
  socials?: {
    facebook?: string;
    telegram?: string;
    linkedin?: string;
    whatsapp?: string;
    instagram?: string;
    [key: string]: string | undefined; // ✅ дозволяє додавати нові соцмережі
  };
}