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
    const { partner_id, dish_id, price, discount, availablePortions } = dto;

    const { data, error } = await this.client
      .from('partner_dishes')
      .insert([{
        partner_id,
        dish_id,
        price,
        discount: discount ?? 0,
        available_portions: availablePortions ?? 0,
      }])
      .select();

    if (error) throw new BadRequestException(error.message);
    return data[0];
  }

  async updateDish(id: string, dto: UpdatePartnerDishDto) {
    const payload = {
      price: dto.price,
      discount: dto.discount ?? 0,
      available_portions: dto.availablePortions ?? 0,
    };
  
    const { data, error } = await this.client
      .from('partner_dishes')
      .update(payload)
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

  /**
   * Шукає страви партнера за назвою.
   * @param partnerId ID партнера.
   * @param query Рядок для пошуку.
   */
  async searchPartnerDishes(partnerId: string, query: string) {
    const { data, error } = await this.client
      .from('partner_dishes')
      .select('*, dishes(*)')
      .eq('partner_id', partnerId)
      .ilike('dishes.name_ua', `%${query}%`);

    if (error) {
      throw new BadRequestException(error.message);
    }
    
    // ✅ Додаємо перевірку на існування об'єкта `dishes` перед фільтрацією
    const filteredData = data.filter(item => 
      // Переконуємося, що `item.dishes` не null або undefined
      item.dishes && (
        (item.dishes as any).name_ua.toLowerCase().includes(query.toLowerCase()) || 
        (item.dishes as any).name_en.toLowerCase().includes(query.toLowerCase())
      )
    );

    return filteredData;
  }
}
