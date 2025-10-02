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

  async getPaginatedDishes(
    page: number,
    limit: number,
    searchQuery?: string,
    category?: string,
    ingredients?: string[],
    isSelected?: boolean,
  ): Promise<{ data: any[]; count: number; page: number; limit: number }> {
    // 1. Розрахунок діапазону
    const from = (page - 1) * limit;
    const to = page * limit - 1;

    let query = this.client.from('dishes').select('*', { count: 'exact' });

    // 2. Фільтрація за is_selected
    if (isSelected !== undefined) {
      query = query.eq('is_selected', isSelected);
    }

    // 3. ✅ Фільтрація за категорією (type)
    // Якщо фільтрація по категорії не працює, перевірте, чи не приходить 'all'
    if (category && category !== 'all') {
      query = query.eq('type', category);
    }

    // 4. ✅ Фільтрація за пошуковим запитом (Search)
    if (searchQuery) {
      // Увага: `or` буде застосовано лише до поточного фільтру,
      // якщо він не поєднаний з іншими, тому ми використовуємо `filter` або `or` на тому ж рівні.
      query = query.or(
        `name_ua.ilike.%${searchQuery}%,name_en.ilike.%${searchQuery}%`,
      );
    }

    // 5. ✅ Фільтрація за інгредієнтами (JSONB)
if (ingredients && ingredients.length > 0) {
    
  // Створення масиву об'єктів для пошуку, де кожне значення має бути перевірено.
  // Якщо інгредієнти - це масив рядків ['Курятина', 'Картопля'], ми формуємо JSONB-рядок для пошуку
  
  // 💡 Це найпростіший синтаксис, який *мав би* працювати для пошуку "хоча б один"
  // у масиві об'єктів за ключем 'name_ua', якщо PostgREST правильно налаштований.
  // Він шукає перетин (contains/overlap).
  
  const ingredientsToSearch = ingredients.map(name_ua => ({ name_ua }));
  const searchJsonb = JSON.stringify(ingredientsToSearch);

  // Використовуємо filter (який рівнозначний .or() для цього випадку)
  // Зверніть увагу на оператор `cs` (містить)
  query = query.filter(
      'important_ingredients', // Стовпець
      'cs',                    // Оператор "містить" (contains)
      searchJsonb              // Значення у форматі JSON
  ); 
  
  // ❌ Видаляємо старий код, що викликав конфлікт:
  /*
  const ingredientOrConditions = ingredients.map((ingName) => {
    return `important_ingredients.cs.'[{"name_ua": "${ingName}"}]'`;
  });
  const orConditions = ingredientOrConditions.join(',');
  query = query.or(orConditions);
  */
}

    // 6. Сортування
    query = query.order('id', { ascending: true });

    // 7. Застосовуємо пагінацію
    // Увага: Пагінація має застосовуватися ОСТАННЬОЮ.
    query = query.range(from, to);

    const { data, count, error } = await query;

    // ... (обробка помилок та повернення даних)
    if (error) {
      console.error(error);
      // Додаємо деталі помилки Supabase для налагодження
      throw new BadRequestException(
        `Помилка Supabase при фільтрації: ${error.message}`,
      );
    }

    return {
      data: data || [],
      count: count || 0,
      page,
      limit,
    };
  }

  // async getAllDishes(isSelected?: boolean) {
  //   let query = this.client.from('dishes').select('*');

  //   if (isSelected !== undefined) {
  //     query = query.eq('is_selected', isSelected);
  //   }

  //   const { data, error } = await query;

  //   if (error) {
  //     throw new Error(error.message);
  //   }

  //   return data;
  // }

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

  // async searchDishes(query: string) {
  //   const { data, error } = await this.client
  //     .from('dishes')
  //     .select('*')
  //     .or(`name_ua.ilike.%${query}%,name_en.ilike.%${query}%`);

  //   if (error) {
  //     throw new Error(error.message);
  //   }

  //   return data;
  // }

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
    return data;
  }

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
      .select(
        '*, user:user_id(firstName, lastName, email), dish:dish_id(name_ua, name_en, photo)',
      ); // ✅ Вкладений запит

    if (error) {
      throw new Error(error.message);
    }

    return data;
  }

  async getSelectedDishes() {
    const { data, error } = await this.client
      .from('dishes')
      .select('*')
      .eq('is_selected', true);
  
    if (error) {
      console.error('Supabase error in getSelectedDishes:', error);
      throw new BadRequestException('Помилка при отриманні вибраних страв');
    }
  
    return data;
  }
}
