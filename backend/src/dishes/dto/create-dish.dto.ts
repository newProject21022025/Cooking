// src/dishes/dto/create-dish.dto.ts

import { IsString, IsNumber, IsOptional, IsArray, ValidateNested, IsBoolean } from 'class-validator';
import { Type } from 'class-transformer';

class IngredientDto {
  @IsString()
  name_ua: string;

  @IsString()
  name_en: string;

  @IsNumber()
  @IsOptional()
  quantity?: number;

  @IsString()
  unit: string;
}

export class CreateDishDto {
    @IsString()
    name_ua: string;
  
    @IsString()
    name_en: string;
  
    @IsString()
    type: string;
  
    @IsString()
    description_ua: string;
  
    @IsString()
    description_en: string;
  
    @IsString()
    photo: string;
  
    @IsNumber()
    standard_servings: number;
  
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => IngredientDto)
    important_ingredients: IngredientDto[];
  
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => IngredientDto)
    optional_ingredients: IngredientDto[];
  
    @IsString()
    recipe_ua: string;
  
    @IsString()
    recipe_en: string;

    @IsBoolean()
    is_selected: boolean;
  }
  