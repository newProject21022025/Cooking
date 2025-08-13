import { IsEmail, IsNotEmpty, IsOptional, IsString, IsNumber, IsArray, IsDateString } from 'class-validator';

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
  @IsString()
  role?: string;

  @IsOptional()
  @IsArray()
  orderHistory?: any[];

  @IsOptional()
  @IsArray()
  favorites?: any[];

  @IsOptional()
  @IsArray()
  rating?: any[];

  @IsOptional()
  @IsNumber()
  discount?: number;

  @IsOptional()
  @IsDateString()
  createdAt?: string;
}
