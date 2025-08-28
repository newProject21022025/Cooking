// src/partner-dishes/dto/create-partner-dish.dto.ts

import { IsUUID, IsNumber, IsOptional, Min } from 'class-validator';

export class CreatePartnerDishDto {
  @IsUUID()
  partner_id: string;

  @IsNumber()
  @Min(1)
  dish_id: number;  // ✅ number

  @IsNumber()
  @Min(0)
  price: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  discount?: number;

  @IsNumber()
  @Min(0)
  availablePortions: number;
}

