// src/partners/partners.service.ts


// src/partners/partners.service.ts

import { Injectable, BadRequestException } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import { CreatePartnerDto } from './dto/create-partner.dto';
import * as bcrypt from 'bcrypt';
import { Partner } from './interfaces/partner.interface'; // <--- Переконайтеся, що ви імпортуєте інтерфейс Partner

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
      .insert([{ ...dto, password: hashedPassword }])
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
    console.error("==> PartnersService: Помилка Supabase:", error);
    throw new BadRequestException(error.message);
  }
  console.log("==> PartnersService: Результат пошуку:", data);
  return data;
}
}













// import { Injectable, BadRequestException } from '@nestjs/common';
// import { SupabaseService } from '../supabase/supabase.service';
// import { CreatePartnerDto } from './dto/create-partner.dto';
// import * as bcrypt from 'bcrypt';

// @Injectable()
// export class PartnersService {
//   constructor(private readonly supabaseService: SupabaseService) {}

//   private get client() {
//     return this.supabaseService.getClient();
//   }

//   async createPartner(dto: CreatePartnerDto) {
//     const hashedPassword = await bcrypt.hash(dto.password, 10);

//     const { data, error } = await this.client
//       .from('partners')
//       .insert([{ ...dto, password: hashedPassword }])
//       .select();

//     if (error) throw new BadRequestException(error.message);
//     return data[0];
//   }

//   async getAllPartners() {
//     const { data, error } = await this.client.from('partners').select('*');
//     if (error) throw new BadRequestException(error.message);
//     return data;
//   }

//   async findOneByEmail(email: string) {
//     const { data, error } = await this.client
//       .from('partners')
//       .select('*')
//       .eq('email', email)
//       .single();
  
//     if (error || !data) return null;
//     return data;
//   }

  
// }
