// src/dishes/dto/create-comment.dto.ts

import { IsString, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

export class CreateCommentDto {
  @IsNumber()
  @IsNotEmpty()
  dish_id: number;

  @IsNumber()
  @IsNotEmpty()
  user_id: string; // Або user_id, якщо ви використовуєте автентифікацію

  @IsString()
  @IsNotEmpty()
  comment_text: string;

  @IsNumber()
  @IsOptional()
  rating?: number; // Можна додати рейтинг, якщо це потрібно
}