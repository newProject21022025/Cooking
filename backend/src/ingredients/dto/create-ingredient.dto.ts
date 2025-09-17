// src/ingredients/dto/create-ingredient.dto.ts

import { IsString, IsArray, IsUrl, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

// Інтерфейс для одного бенефіту з двома мовами
export class BenefitDto {
  @IsString()
  text_uk: string;

  @IsString()
  text_en: string;
}

// Інтерфейс для створення нового інгредієнта
export class CreateIngredientDto {
  @IsString()
  name_uk: string;

  @IsString()
  name_en: string;

  @IsString()
  @IsUrl() // Додатково можна валідувати, що це URL
  image: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => BenefitDto) // Важливо для правильної трансформації вкладених об'єктів
  benefits: BenefitDto[];
}