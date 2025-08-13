import { Injectable, BadRequestException } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  constructor(private readonly supabaseService: SupabaseService) {}

  async createUser(dto: CreateUserDto) {
    if (!dto.email || !dto.password) {
      throw new BadRequestException('Email and password are required');
    }

    const { data, error } = await this.supabaseService
      .getClient()
      .from('Users') // таблиця в Supabase
      .insert([{ ...dto, createdAt: new Date().toISOString() }]);

    if (error) {
      throw new BadRequestException(error.message);
    }

    return data;
  }
}
