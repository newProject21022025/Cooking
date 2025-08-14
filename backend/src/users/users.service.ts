// src/users/users.service.ts


import { Injectable, BadRequestException } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private readonly supabaseService: SupabaseService) {}

  async createUser(dto: CreateUserDto) {
    if (!dto.email || !dto.password) {
      throw new BadRequestException('Email and password are required');
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);

    console.log('Попытка вставки в таблицу:', 'users'); // Добавили лог
    const { data, error } = await this.supabaseService
      .getClient()
      .from('users') // Проверьте, что здесь 'users' с маленькой буквы
      .insert([{
        ...dto,
        password: hashedPassword,
        // createdAt: new Date().toISOString() // ✨ УДАЛЕНО: Supabase сделает это автоматически
      }]);

    if (error) {
      console.error('Ошибка при вставке пользователя:', error.message); // Добавили лог
      throw new BadRequestException(error.message);
    }

    console.log('Пользователь успешно создан:', data); // Добавили лог
    return data ? data[0] : null;
  }

  async findOneByEmail(email: string): Promise<any | undefined> {
    console.log('Попытка поиска пользователя по email в таблице:', 'users'); // Добавили лог
    const { data, error } = await this.supabaseService
      .getClient()
      .from('users') // Проверьте, что здесь 'users' с маленькой буквы
      .select('*')
      .eq('email', email)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return undefined;
      }
      console.error('Ошибка при поиске пользователя по email:', error.message); // Добавили лог
      throw new BadRequestException(error.message);
    }
    return data;
  }

  async findOneById(id: string): Promise<any | undefined> {
    console.log('Попытка поиска пользователя по ID в таблице:', 'users'); // Добавили лог
    const { data, error } = await this.supabaseService
      .getClient()
      .from('users') // Проверьте, что здесь 'users' с маленькой буквы
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return undefined;
      }
      console.error('Ошибка при поиске пользователя по ID:', error.message); // Добавили лог
      throw new BadRequestException(error.message);
    }
    return data;
  }
}




// import { Injectable, BadRequestException } from '@nestjs/common';
// import { SupabaseService } from '../supabase/supabase.service';
// import { CreateUserDto } from './dto/create-user.dto';
// import * as bcrypt from 'bcrypt';

// @Injectable()
// export class UsersService {
//   constructor(private readonly supabaseService: SupabaseService) {}

//   async createUser(dto: CreateUserDto) {
//     if (!dto.email || !dto.password) {
//       throw new BadRequestException('Email and password are required');
//     }

//     const hashedPassword = await bcrypt.hash(dto.password, 10);

//     const { data, error } = await this.supabaseService
//       .getClient()
//       .from('users') // Изменено на 'Users' (с большой буквы) для консистентности
//       .insert([{
//         ...dto,
//         password: hashedPassword,
//         // createdAt: new Date().toISOString() // Если Supabase автоматически добавляет createdAt, эту строку можно удалить
//       }]);

//     if (error) {
//       // Здесь можно добавить более детальное логирование ошибки, если нужно
//       throw new BadRequestException(error.message);
//     }

//     // Supabase insert возвращает массив, если insert успешен, или null.
//     // Если нужно вернуть данные о созданном пользователе, убедитесь, что data не null и возьмите первый элемент
//     return data ? data[0] : null; 
//   }

//   async findOneByEmail(email: string): Promise<any | undefined> {
//     const { data, error } = await this.supabaseService
//       .getClient()
//       .from('Users')
//       .select('*')
//       .eq('email', email)
//       .single();

//     if (error) {
//       // Часто при отсутствии записи single() возвращает ошибку,
//       // но это не всегда Bad Request. Можно обрабатывать иначе.
//       // Например, просто вернуть undefined, если запись не найдена,
//       // а ошибку бросать только при реальных проблемах с БД.
//       if (error.code === 'PGRST116') { // Пример кода ошибки Supabase для "не найдено"
//         return undefined;
//       }
//       throw new BadRequestException(error.message);
//     }
//     return data;
//   }

//   async findOneById(id: string): Promise<any | undefined> {
//     const { data, error } = await this.supabaseService
//       .getClient()
//       .from('Users')
//       .select('*')
//       .eq('id', id)
//       .single();

//     if (error) {
//        // Аналогичная обработка ошибки, как в findOneByEmail
//       if (error.code === 'PGRST116') {
//         return undefined;
//       }
//       throw new BadRequestException(error.message);
//     }
//     return data;
//   }
// }
