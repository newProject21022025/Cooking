// src/dishes/dishes.service.ts

import { Injectable, BadRequestException } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import { CreateDishDto } from './dto/create-dish.dto';
import { UpdateDishDto } from './dto/update-dish.dto';
import { CreateCommentDto } from './dto/create-comment.dto'; // ✅ Імпортуємо новий DTO

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
    // ✅ Оновлюємо запит, щоб отримати коментарі разом зі стравою
    const { data, error } = await this.client
      .from('dishes')
      .select('*, comments(*, user:user_id(*))')
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

  async searchDishes(query: string) {
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

  // ✅ Нові методи для роботи з коментарями

  async getCommentById(commentId: number) {
    const { data, error } = await this.client
      .from('comments')
      // .select('*')
      .select('*, user:user_id(*), dish:dish_id(*)')
      .eq('id', commentId)
      .single();

    if (error) {
      throw new Error(error.message);
    }
    return data;  }

  /**
   * Додає новий коментар до страви.
   */
  async addComment(createCommentDto: CreateCommentDto) {
    // В Supabase ці поля автоматично заповнюються.
    // Якщо у вас немає userId в DTO, то його можна взяти з токена авторизації в контролері.
    const { data, error } = await this.client
      .from('comments')
      .insert([createCommentDto])
      .select();

    if (error) {
      throw new Error(error.message);
    }
    return data[0];
  }

  /**
   * Видаляє коментар за його ID.
   */
  async deleteComment(commentId: number) {
    const { data, error } = await this.client
      .from('comments')
      .delete()
      .eq('id', commentId)
      .select();

    if (error) {
      throw new Error(error.message);
    }
    return data[0];
  }

  async getAllComments() {
    const { data, error } = await this.client
      .from('comments')
      .select('*, user:user_id(firstName, lastName, email), dish:dish_id(name_ua, name_en, photo)'); // ✅ Вкладений запит
    
    if (error) {
      throw new Error(error.message);
    }

    return data;
  }
}