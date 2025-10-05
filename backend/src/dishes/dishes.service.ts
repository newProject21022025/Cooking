import { Injectable, BadRequestException } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import { CreateDishDto } from './dto/create-dish.dto';
import { UpdateDishDto } from './dto/update-dish.dto';
import { CreateCommentDto } from './dto/create-comment.dto';

@Injectable()
export class DishesService {
  constructor(private readonly supabaseService: SupabaseService) {}

  private get client() {
    return this.supabaseService.getClient();
  }

  // ------------------------------
  // Страви
  // ------------------------------
  async createDish(dish: CreateDishDto) {
    const { data, error } = await this.client.from('dishes').insert([dish]);
    if (error) throw new BadRequestException(error.message);
    return data ?? [];
  }

  async getPaginatedDishes(
    page = 1,
    limit = 10,
    searchQuery?: string,
    category?: string,
    ingredients?: string[],
    isSelected?: boolean,
  ) {
    const from = (page - 1) * limit;
    const to = page * limit - 1;

    let query = this.client.from('dishes').select('*', { count: 'exact' });

    if (isSelected !== undefined) query = query.eq('is_selected', isSelected);
    if (category && category !== 'all') query = query.eq('type', category);
    if (searchQuery) {
      query = query.or(
        `name_ua.ilike.%${searchQuery}%,name_en.ilike.%${searchQuery}%`,
      );
    }

    if (ingredients && ingredients.length > 0) {
      // Створюємо JSONB масив для пошуку хоча б одного інгредієнта
      const searchJson = JSON.stringify(ingredients.map(name_ua => ({ name_ua })));
      query = query.filter('important_ingredients', 'cs', searchJson);
    }

    query = query.order('id', { ascending: true }).range(from, to);

    const { data, count, error } = await query;
    if (error) throw new BadRequestException(`Помилка Supabase: ${error.message}`);

    return {
      data: data || [],
      count: count || 0,
      page,
      limit,
    };
  }

  async getDishById(id: number) {
    const { data, error } = await this.client
      .from('dishes')
      .select('*, comments(*, user:user_id(*))')
      .eq('id', id)
      .single();
    if (error) throw new BadRequestException(error.message);
    return data;
  }

  async updateDish(id: number, dto: UpdateDishDto) {
    const { data, error } = await this.client
      .from('dishes')
      .update(dto)
      .eq('id', id)
      .select();
    if (error) throw new BadRequestException(error.message);
    return data ? data[0] : null;
  }

  async deleteDish(id: number) {
    const { data, error } = await this.client
      .from('dishes')
      .delete()
      .eq('id', id)
      .select();
    if (error) throw new BadRequestException(error.message);
    return data ? data[0] : null;
  }

  async selectDish(id: number) {
    return this.updateDish(id, { is_selected: true });
  }

  async unselectDish(id: number) {
    return this.updateDish(id, { is_selected: false });
  }

  async getSelectedDishes() {
    const { data, error } = await this.client
      .from('dishes')
      .select('*')
      .eq('is_selected', true);
    if (error) throw new BadRequestException('Помилка при отриманні вибраних страв');
    return data || [];
  }

  // ------------------------------
  // Коментарі
  // ------------------------------
  async getCommentById(commentId: number) {
    const { data, error } = await this.client
      .from('comments')
      .select('*, user:user_id(*), dish:dish_id(*)')
      .eq('id', commentId)
      .single();
    if (error) throw new BadRequestException(error.message);
    return data;
  }

  async addComment(createCommentDto: CreateCommentDto) {
    const { data, error } = await this.client
      .from('comments')
      .insert([createCommentDto])
      .select();
    if (error) throw new BadRequestException(error.message);
    return data[0];
  }

  async deleteComment(commentId: number) {
    const { data, error } = await this.client
      .from('comments')
      .delete()
      .eq('id', commentId)
      .select();
    if (error) throw new BadRequestException(error.message);
    return data[0];
  }

  async getAllComments() {
    const { data, error } = await this.client
      .from('comments')
      .select('*, user:user_id(firstName, lastName, email), dish:dish_id(name_ua, name_en, photo)');
    if (error) throw new BadRequestException(error.message);
    return data || [];
  }

  async getAllDishes(searchQuery?: string, category?: string) {
  let query = this.client.from('dishes').select('*');

  if (category && category !== 'all') {
    query = query.eq('type', category);
  }

  if (searchQuery) {
    query = query.or(
      `name_ua.ilike.%${searchQuery}%,name_en.ilike.%${searchQuery}%`,
    );
  }

  const { data, error } = await query.order('id', { ascending: true });
  if (error) throw new BadRequestException(`Помилка Supabase: ${error.message}`);

  return data || [];
}

}
