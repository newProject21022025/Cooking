// src/ingredients/ingredients.service.ts

import { Injectable } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import { CreateIngredientDto } from './dto/create-ingredient.dto';
import { UpdateIngredientDto } from './dto/update-ingredient.dto';
import { Ingredient } from './interfaces/ingredient.interface';

@Injectable()
export class IngredientsService {
  constructor(private readonly supabaseService: SupabaseService) {}

  async create(createIngredientDto: CreateIngredientDto): Promise<Ingredient> {
    const { data, error } = await this.supabaseService.client
      .from('ingredients')
      .insert([createIngredientDto])
      .select()
      .single();

    if (error) {
      console.error('Supabase create error:', error);
      throw new Error(`Failed to create ingredient: ${error.message}`);
    }

    if (!data) {
      throw new Error('Supabase did not return the created ingredient.');
    }

    return data;
  }

  async findOneByName(name_en: string): Promise<Ingredient | null> {
    const { data, error } = await this.supabaseService.client
      .from('ingredients')
      .select('*')
      .eq('name_en', name_en)
      .single();

    if (error && error.code !== 'PGRST116') {
      throw new Error(error.message);
    }

    return data;
  }

  // ---

  async update(id: string, updateIngredientDto: UpdateIngredientDto): Promise<Ingredient | null> {
    const { data, error } = await this.supabaseService.client
      .from('ingredients')
      .update(updateIngredientDto)
      .eq('id', id)
      .select() // ✅ Оновлення: додано .select() для повернення оновлених даних
      .single(); // ✅ Оновлення: додано .single() для отримання одного об'єкта

    if (error) {
      // Обробляємо помилку, якщо інгредієнт не знайдено (код PGRST116)
      if (error.code !== 'PGRST116') {
        throw new Error(`Failed to update ingredient: ${error.message}`);
      }
      return null;
    }
    
    // Перевіряємо, чи дані були повернені після оновлення
    if (!data) {
      // Якщо даних немає, це означає, що запис не знайдено або не оновлено
      return null;
    }

    return data;
  }
  
  // ---

  async remove(id: string): Promise<any | null> {
    const { data, error } = await this.supabaseService.client
      .from('ingredients')
      .delete()
      .eq('id', id)
      .select() // ✅ Оновлення: повертаємо видалений об'єкт
      .single();

    if (error) {
       if (error.code !== 'PGRST116') {
        throw new Error(`Failed to remove ingredient: ${error.message}`);
      }
      return null;
    }
    return data;
  }

  async findAll(): Promise<Ingredient[]> {
    const { data, error } = await this.supabaseService.client
      .from('ingredients')
      .select('*');

    if (error) {
      throw new Error(`Failed to fetch ingredients: ${error.message}`);
    }
    return data || [];
  }
}

