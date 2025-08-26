// src/users/users.service.ts

import { Injectable, BadRequestException } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(private readonly supabaseService: SupabaseService) {}

  async createUser(dto: CreateUserDto) {
    if (!dto.email || !dto.password) {
      throw new BadRequestException('Email and password are required');
    }
  
    const hashedPassword = await bcrypt.hash(dto.password, 10);
  
    console.log('Попытка вставки в таблицу:', 'users'); 
    const { data, error } = await this.supabaseService
      .getClient()
      .from('users') 
      .insert([{
        ...dto,
        password: hashedPassword,
        role: dto.role ?? 'user',   // <-- дефолтна роль user
        isBlocked: dto.isBlocked ?? false, // <-- дефолт false
      }])
      .select(); // щоб одразу повернути створений рядок
  
    if (error) {
      console.error('Ошибка при вставке пользователя:', error.message); 
      throw new BadRequestException(error.message);
    }
  
    console.log('Пользователь успешно создан:', data); 
    return data ? data[0] : null;
  }

  async findOneByEmail(email: string): Promise<any | undefined> {
    console.log('Попытка поиска пользователя по email в таблице:', 'users'); 
    const { data, error } = await this.supabaseService
      .getClient()
      .from('users') 
      .select('*')
      .eq('email', email)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return undefined;
      }
      console.error('Ошибка при поиске пользователя по email:', error.message);
      throw new BadRequestException(error.message);
    }
    return data;
  }
 

  async updateUser(id: string, dto: UpdateUserDto) {
    // Якщо пароль передають — хешуємо його
    if (dto.password) {
      dto.password = await bcrypt.hash(dto.password, 10);
    }
  
    const { data, error } = await this.supabaseService
      .getClient()
      .from('users')
      .update(dto)
      .eq('id', id)
      .select();
  
    if (error) {
      console.error('Помилка при оновленні користувача:', error.message);
      throw new BadRequestException(error.message);
    }
  
    return data ? data[0] : null;
  }

  async deleteUser(id: string) {
    const { data, error } = await this.supabaseService
      .getClient()
      .from('users')
      .delete()
      .eq('id', id)
      .select();
  
    if (error) {
      console.error('Помилка при видаленні користувача:', error.message);
      throw new BadRequestException(error.message);
    }
  
    return data ? data[0] : null;
  }  

  async setBlockStatus(userId: string, isBlocked: boolean) {
    const { data, error } = await this.supabaseService
      .getClient()
      .from('users')
      .update({ isBlocked })
      .eq('id', userId)
      .select();
  
    if (error) {
      console.error('Помилка при зміні статусу блокування:', error.message);
      throw new BadRequestException(error.message);
    }
  
    return data ? data[0] : null;
  }

   async findOneById(id: string): Promise<any | undefined> {
    console.log('Попытка поиска пользователя по ID в таблице:', 'users');
    const { data, error } = await this.supabaseService
      .getClient()
      .from('users')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return undefined;
      }
      console.error('Помилка при пошуку користувача по ID:', error.message);
      throw new BadRequestException(error.message);
    }
    return data;
  }
  
  async findAll(): Promise<any[]> {
    const { data, error } = await this.supabaseService
      .getClient()
      .from('users')
      .select('*');
  
    if (error) {
      console.error('Помилка при отриманні всіх користувачів:', error.message);
      throw new BadRequestException(error.message);
    }
  
    return data;
  }
  async uploadUserAvatar(userId: string, file: Express.Multer.File) {
    // 1. Генеруємо унікальне ім'я файлу, щоб уникнути конфліктів
    const fileExtension = file.originalname.split('.').pop();
    const fileName = `avatar-${userId}-${Date.now()}.${fileExtension}`;
    const filePath = `user_avatars/${fileName}`; // Папка в Supabase Storage

    // 2. Завантажуємо файл в Supabase Storage
    const { data: uploadData, error: uploadError } = await this.supabaseService
      .getClient()
      .storage
      .from('avatars') // Назва вашого бакета в Supabase Storage (створити заздалегідь в панелі Supabase)
      .upload(filePath, file.buffer, {
        cacheControl: '3600',
        upsert: true // Якщо файл існує - перезаписати
      });

    if (uploadError) {
      console.error('Помилка завантаження файлу:', uploadError.message);
      throw new BadRequestException('Не вдалося завантажити зображення');
    }

    // 3. Отримуємо публічний URL завантаженого файлу
    const { data: urlData } = this.supabaseService
      .getClient()
      .storage
      .from('avatars')
      .getPublicUrl(filePath);

    const publicUrl = urlData.publicUrl;

    // 4. Оновлюємо поле 'photo' у користувача в базі даних
    const { data, error } = await this.supabaseService
      .getClient()
      .from('users')
      .update({ photo: publicUrl })
      .eq('id', userId)
      .select();

    if (error) {
      console.error('Помилка оновлення фото користувача:', error.message);
      throw new BadRequestException('Не вдалося оновити профіль');
    }

    return data ? data[0] : null;
  }
}
