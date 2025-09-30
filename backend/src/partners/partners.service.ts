// src/partners/partners.service.ts

import { Injectable, BadRequestException } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import { CreatePartnerDto } from './dto/create-partner.dto';
import * as bcrypt from 'bcrypt';
import { Partner } from './interfaces/partner.interface'; // <--- Переконайтеся, що ви імпортуєте інтерфейс Partner
import { UpdatePartnerDto } from './dto/update-partner.dto';
// import { ChangePartnerPasswordDto } from './dto/change-partner-password.dto';

@Injectable()
export class PartnersService {
  constructor(private readonly supabaseService: SupabaseService) {}

  private get client() {
    return this.supabaseService.getClient();
  }

  async createPartner(dto: CreatePartnerDto) {
    const hashedPassword = await bcrypt.hash(dto.password, 10);
  
    const { data, error } = await this.client
      .from('partners')
      .insert([{
        ...dto,
        password: hashedPassword,
        role: dto.role ?? 'partner',   // <-- дефолт partner
        isBlocked: dto.isBlocked ?? false, // <-- дефолт false
      }])
      .select();
  
    if (error) throw new BadRequestException(error.message);
    return data[0];
  }

  async getAllPartners() {
    const { data, error } = await this.client.from('partners').select('*');
    if (error) throw new BadRequestException(error.message);
    return data;
  }

  async findOneByEmail(email: string) {
    const { data, error } = await this.client
      .from('partners')
      .select('*')
      .eq('email', email)
      .single();

    if (error || !data) return null;
    return data;
  }

  // --- Виправлений метод findOneById ---
  async findOneById(id: string): Promise<any | undefined> {
    console.log(`==> PartnersService: Пошук партнера за ID: ${id}`);
    const { data, error } = await this.client
      .from('partners')
      .select('*')
      .eq('id', id)
      .single();

    if (error && error.code !== 'PGRST116') {
      console.error('==> PartnersService: Помилка Supabase:', error);
      throw new BadRequestException(error.message);
    }
    console.log('==> PartnersService: Результат пошуку:', data);
    return data;
  }

  async deletePartner(id: string) {
    // Якщо є залежні записи (наприклад, partner-dishes), переконайся,
    // що у БД налаштовано ON DELETE CASCADE або видаляй їх спочатку.
    const { data, error } = await this.client
      .from('partners')
      .delete()
      .eq('id', id)
      .select()
      .single();

    if (error) throw new BadRequestException(error.message);
    return data; // повертаємо видалений запис (або можеш віддати { success: true })
  }

  async toggleBlockPartner(id: string) {
    const partner = await this.findOneById(id);
    if (!partner) {
      throw new BadRequestException('Партнер не знайдений');
    }

    const newStatus = !partner.isBlocked;

    const { data, error } = await this.client
      .from('partners')
      .update({ isBlocked: newStatus })
      .eq('id', id)
      .select();

    if (error) throw new BadRequestException(error.message);

    return data[0];
  }
  async updatePartner(id: string, dto: UpdatePartnerDto) {
    const partner = await this.findOneById(id);
    if (!partner) {
      throw new BadRequestException('Партнер не знайдений');
    }
  
    const updateData: any = { ...dto };
  
    if (dto.password) {
      updateData.password = await bcrypt.hash(dto.password, 10);
    }
  
    // 🔹 Якщо socials передані, збережемо їх у JSONB
    if (dto.socials) {
      updateData.socials = dto.socials;
    }
  
    const { data, error } = await this.client
      .from('partners')
      .update(updateData)
      .eq('id', id)
      .select();
  
    if (error) throw new BadRequestException(error.message);
  
    return data[0];
  }
  async updatePassword(id: string, hashedPassword: string) {
    const { data, error } = await this.client
      .from('partners')
      .update({ password: hashedPassword })
      .eq('id', id)
      .select()
      .single();
  
    if (error) throw new BadRequestException(error.message);
  
    return data;
  }
  async changePassword(id: string, currentPassword: string, newPassword: string) {
    const partner = await this.findOneById(id);
    if (!partner) throw new BadRequestException('Партнер не знайдений');
  
    const isMatch = await bcrypt.compare(currentPassword, partner.password);
    if (!isMatch) throw new BadRequestException('Поточний пароль невірний');
  
    const hashedPassword = await bcrypt.hash(newPassword, 10);
  
    const { data, error } = await this.client
      .from('partners')
      .update({ password: hashedPassword })  // тільки пароль
      .eq('id', id)
      .select()
      .single();
  
    if (error) throw new BadRequestException(error.message);
  
    return data;
  }
}
