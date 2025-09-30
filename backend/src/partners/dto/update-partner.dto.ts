// src/partners/dto/update-partner.dto.ts
import { IsOptional, IsString, IsEmail, IsBoolean, IsNumber, IsObject } from 'class-validator';

export class UpdatePartnerDto {
  @IsOptional()
  @IsString()
  firstName?: string;

  @IsOptional()
  @IsString()
  lastName?: string;

  @IsOptional()
  @IsString()
  avatar?: string;

  @IsOptional()
  @IsString()
  photo?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  password?: string;

  @IsOptional()
  @IsString()
  phoneNumber?: string;

  @IsOptional()
  @IsString()
  deliveryAddress?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  role?: string;

  @IsOptional()
  @IsNumber()
  rating?: number;

  @IsOptional()
  @IsBoolean()
  isBlocked?: boolean;

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
