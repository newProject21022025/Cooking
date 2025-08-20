// src/auth/auth.service.ts


import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PartnersService } from '../partners/partners.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private partnersService: PartnersService, // <-- додали
    private jwtService: JwtService,
  ) {}

  async login(email: string, pass: string) {
    // спробувати знайти в users
    let user = await this.usersService.findOneByEmail(email);
    
    // якщо не знайдено, шукати в partners
    if (!user) {
      user = await this.partnersService.findOneByEmail(email);
    }

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordMatching = await bcrypt.compare(pass, user.password);
    if (!isPasswordMatching) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { email: user.email, sub: user.id, role: user.role };
    return {
      access_token: this.jwtService.sign(payload),
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