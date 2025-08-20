// src/partner-dishes/partner-dishes.service.ts

import { Injectable, BadRequestException } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import { CreatePartnerDishDto } from './dto/create-partner-dish.dto';
import { UpdatePartnerDishDto } from './dto/update-partner-dish.dto';

@Injectable()
export class PartnerDishesService {
  constructor(private readonly supabaseService: SupabaseService) {}

  private get client() {
    return this.supabaseService.getClient();
  }

  async addDish(dto: CreatePartnerDishDto) {
    const { data, error } = await this.client
      .from('partner_dishes')
      .insert([dto])
      .select();

    if (error) throw new BadRequestException(error.message);
    return data[0];
  }

  async updateDish(id: string, dto: UpdatePartnerDishDto) {
    const { data, error } = await this.client
      .from('partner_dishes')
      .update(dto)
      .eq('id', id)
      .select();

    if (error) throw new BadRequestException(error.message);
    return data[0];
  }

  async deleteDish(id: string) {
    const { data, error } = await this.client
      .from('partner_dishes')
      .delete()
      .eq('id', id)
      .select();

    if (error) throw new BadRequestException(error.message);
    return data[0];
  }

  async getPartnerMenu(partnerId: string) {
    const { data, error } = await this.client
      .from('partner_dishes')
      .select('*, dishes(*)')
      .eq('partner_id', partnerId);

    if (error) throw new BadRequestException(error.message);
    return data;
  }
}
