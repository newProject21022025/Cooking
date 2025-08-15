import { Injectable, BadRequestException } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import { CreatePartnerDto } from './dto/create-partner.dto';
import * as bcrypt from 'bcrypt';

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
}
