import { IsUUID, IsNumber, IsOptional } from 'class-validator';

export class CreatePartnerDishDto {
  @IsUUID()
  partner_id: string;

  @IsNumber()
  dish_id: number;

  @IsNumber()
  price: number;

  @IsOptional()
  @IsNumber()
  discount?: number;

  @IsNumber()
  availablePortions: number;
}
