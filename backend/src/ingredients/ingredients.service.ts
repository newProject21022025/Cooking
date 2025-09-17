// src/ingredients/ingredients.service.ts
import { Injectable } from '@nestjs/common';
import { SupabaseService } from 'src/supabase/supabase.service';
import { CreateIngredientDto } from './dto/create-ingredient.dto';
import { UpdateIngredientDto } from './dto/update-ingredient.dto';
import { Ingredient } from './interfaces/ingredient.interface'; // ✅ Припускаємо, що у вас є цей інтерфейс

@Injectable()
export class IngredientsService {
  constructor(private readonly supabaseService: SupabaseService) {}

  async create(createIngredientDto: CreateIngredientDto) {
    const { data, error } = await this.supabaseService.client
      .from('ingredients')
      .insert([createIngredientDto]);

    if (error) {
      throw new Error(error.message);
    }
    return data;
  }

  // ✅ Новий метод для пошуку за назвою
  async findOneByName(name_en: string): Promise<Ingredient | null> {
    const { data, error } = await this.supabaseService.client
      .from('ingredients')
      .select('*')
      .eq('name_en', name_en)
      .single(); // ✅ .single() повертає один запис або null

    if (error && error.code !== 'PGRST116') { // Код 'PGRST116' означає 'no rows found'
      throw new Error(error.message);
    }
    
    // Якщо запис не знайдено, data буде null
    return data;
  }

  async update(id: string, updateIngredientDto: UpdateIngredientDto) {
    const { data, error } = await this.supabaseService.client
      .from('ingredients')
      .update(updateIngredientDto)
      .eq('id', id);

    if (error) {
      throw new Error(error.message);
    }
    return data;
  }

  async remove(id: string) {
    const { data, error } = await this.supabaseService.client
      .from('ingredients')
      .delete()
      .eq('id', id);

    if (error) {
      throw new Error(error.message);
    }
    return data;
  }
}