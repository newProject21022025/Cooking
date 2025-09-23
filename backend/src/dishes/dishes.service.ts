// src/dishes/dishes.service.ts

import { Injectable } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import { CreateDishDto } from './dto/create-dish.dto';
import { UpdateDishDto } from './dto/update-dish.dto';

@Injectable()
export class DishesService {
  constructor(private readonly supabaseService: SupabaseService) {}

  private get client() {
    return this.supabaseService.getClient();
  }

  async createDish(dish: CreateDishDto) {
    const { data, error } = await this.client.from('dishes').insert([dish]);

    if (error) {
      throw new Error(error.message);
    }

    return data;
  }

  async getAllDishes(isSelected?: boolean) {
    let query = this.client.from('dishes').select('*');

    // ✅ Додаємо умову для фільтрації, якщо параметр isSelected передано
    if (isSelected !== undefined) {
      query = query.eq('is_selected', isSelected);
    }

    const { data, error } = await query;

    if (error) {
      throw new Error(error.message);
    }

    return data;
  }

  async getDishById(id: number) {
    const { data, error } = await this.client
      .from('dishes')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return data;
  }

  async updateDish(id: number, dto: UpdateDishDto) {
    const { data, error } = await this.client
      .from('dishes')
      .update(dto)
      .eq('id', id)
      .select();

    if (error) {
      throw new Error(error.message);
    }

    return data ? data[0] : null;
  }

  async deleteDish(id: number) {
    const { data, error } = await this.client
      .from('dishes')
      .delete()
      .eq('id', id)
      .select();

    if (error) {
      throw new Error(error.message);
    }

    return data ? data[0] : null;
  }

  /**
   * Шукає страви за назвою (українською або англійською).
   * @param query Рядок для пошуку.
   */
  async searchDishes(query: string) {
    // ✅ Використовуємо .ilike() для пошуку без урахування регістру
    // Пошук проводиться в обох полях: name_ua та name_en
    const { data, error } = await this.client
      .from('dishes')
      .select('*')
      .or(`name_ua.ilike.%${query}%,name_en.ilike.%${query}%`);

    if (error) {
      throw new Error(error.message);
    }

    return data;
  }

  async selectDish(id: number) {
    return this.updateDish(id, { is_selected: true });
  }

  async unselectDish(id: number) {
    return this.updateDish(id, { is_selected: false });
  }

  
}
