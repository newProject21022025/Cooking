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

  // Поле з перекладом під мови
  @IsOptional()
  @IsObject()
  deliveryAddress?: {
    uk?: string;
    en?: string;
  };

  @IsOptional()
  @IsObject()
  description?: {
    uk?: string;
    en?: string;
  };

  @IsOptional()
  @IsEnum(PartnerRole)
  role: PartnerRole = PartnerRole.partner;

  @IsOptional()
  orderHistory?: any[];

  @IsOptional()
  favorites?: any[];

  @IsOptional()
  @IsNumber()
  rating?: number;

  @IsOptional()
  @IsBoolean()
  isBlocked: boolean = false;

  @IsOptional()
  @IsObject()
  socials?: {
    facebook?: string;
    telegram?: string;
    linkedin?: string;
    whatsapp?: string;
    instagram?: string;
    [key: string]: string | undefined;
  };
}
