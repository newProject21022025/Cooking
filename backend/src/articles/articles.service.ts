// src/articles/articles.service.ts

import { Injectable } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import { CreateArticleDto } from './dto/create-article.dto';

@Injectable()
export class ArticlesService {
  private table = 'articles'; // назва таблиці в Supabase

  constructor(private readonly supabase: SupabaseService) {}

  async create(dto: CreateArticleDto) {
    const { data, error } = await this.supabase.client
      .from(this.table)
      .insert(dto)
      .select();

    if (error) throw new Error(error.message);

    return data[0];
  }

  async findAll() {
    const { data, error } = await this.supabase.client.from(this.table).select('*');

    if (error) throw new Error(error.message);

    return data;
  }

  async findOne(id: number) {
    const { data, error } = await this.supabase.client
      .from(this.table)
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw new Error(error.message);

    return data;
  }

  async update(id: number, dto: Partial<CreateArticleDto>) {
    const { data, error } = await this.supabase.client
      .from(this.table)
      .update(dto)
      .eq('id', id)
      .select();

    if (error) throw new Error(error.message);

    return data[0];
  }

  async remove(id: number) {
    const { error } = await this.supabase.client
      .from(this.table)
      .delete()
      .eq('id', id);

    if (error) throw new Error(error.message);

    return { message: 'Article deleted' };
  }
}
