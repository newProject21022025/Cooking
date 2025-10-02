import { IsOptional, IsInt, Min, Max, IsBooleanString, IsString, IsArray } from 'class-validator';
import { Type } from 'class-transformer';

export class PaginationQueryDto {
  
    // ✅ Прибрали "?" (зробили поле обов'язковим для TypeScript)
    @IsOptional() 
    @IsInt()
    @Min(1)
    @Type(() => Number)
    page: number = 1; 
  
    // ✅ Прибрали "?"
    @IsOptional() 
    @IsInt()
    @Min(1)
    @Max(100)
    @Type(() => Number)
    limit: number = 10; 
  
    @IsOptional()
    @IsBooleanString()
    is_selected?: string; 
  
    @IsOptional()
    query?: string;

    @IsOptional()
    @IsString()
    category?: string; // ✅ Нове поле для типу страви (наприклад, 'soup')

    @IsOptional()
    @Type(() => String) 
    ingredients?: string[] | string; // Залишаємо гнучкий тип
  }