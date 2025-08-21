// src/auth/auth.service.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { PartnersService } from '../partners/partners.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private partnersService: PartnersService,
    private jwtService: JwtService,
  ) {}

  async login(email: string, password: string) {
    let entity;
    let role;

    entity = await this.usersService.findOneByEmail(email);
    if (entity) {
      role = 'user';
    }

    if (!entity) {
      entity = await this.partnersService.findOneByEmail(email);
      if (entity) {
        role = 'partner';
      }
    }

    if (!entity) {
      throw new UnauthorizedException('Невірні дані (користувача не знайдено)');
    }
    
    // ==> ЛОГ: Перевіряємо, чи є ID
    console.log("==> AuthService: Знайдено об'єкт. Його ID:", entity.id);

    const passwordMatch = await bcrypt.compare(password, entity.password);
    if (!passwordMatch) {
      throw new UnauthorizedException('Невірні дані (пароль невірний)');
    }

    const payload = {
      sub: entity.id,
      email: entity.email,
      role: role
    };

    // ==> ЛОГ: Перевіряємо пейлоад перед підписанням
    console.log("==> AuthService: Payload для токена:", payload);

    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: entity.id,
        email: entity.email,
        firstName: entity.firstName,
        lastName: entity.lastName,
        role: role,
      },
    };
  }
}
  


// import { Injectable } from "@nestjs/common";
// import { ConfigService } from "@nestjs/config";
// import { createClient, SupabaseClient } from "@supabase/supabase-js";


// @Injectable()
// export class AuthService {
//   private supabase: SupabaseClient;

//   constructor(private readonly configService: ConfigService) {
    
//     this.supabase = createClient(
//       this.configService.get<string>("SUPABASE_URL"),
//       this.configService.get<string>("SUPABASE_KEY")
//     );
//   }

//   // Вхід користувача
//   async loginUser(email: string, password: string): Promise<{ token: string }> {
//     const { data, error } = await this.supabase.auth.signInWithPassword({
//       email,
//       password,
//     });

//     if (error) {
//       throw new Error(error.message);
//     }

//     return { token: data.session?.access_token || "" };
//   }

//   // Вхід партнера
//   async loginPartner(email: string, password: string): Promise<{ token: string }> {
//     // тут може бути інша логіка (наприклад, таблиця partner_users у Supabase)
//     const { data, error } = await this.supabase.auth.signInWithPassword({
//       email,
//       password,
//     });

//     if (error) {
//       throw new Error(error.message);
//     }

//     return { token: data.session?.access_token || "" };
//   }
// }