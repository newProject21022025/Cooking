// src/auth/jwt.strategy.ts

import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UsersService } from '../users/users.service';
import { PartnersService } from '../partners/partners.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private usersService: UsersService,
    private partnersService: PartnersService,
    private configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET')!,
    });
  }

  async validate(payload: { sub: string; email: string; role: 'user' | 'partner' | 'admin' }) {
    // ==> ЛОГ: Перевіряємо пейлоад, який надходить від токена
    console.log("==> JwtStrategy: Валідація токена. Пейлоад:", payload);
    
    // ==> ЛОГ: Перевіряємо, чи існує sub
    console.log("==> JwtStrategy: ID користувача (sub):", payload.sub);

    // ==> ЛОГ: Перевіряємо, чи існує role
    console.log("==> JwtStrategy: Роль користувача:", payload.role);

    if (!payload.sub || !payload.role) {
      console.error("==> JwtStrategy: Відсутній sub або role у токені.");
      throw new UnauthorizedException("Некоректний токен");
    }

    let entity;

    if (payload.role === 'user' || payload.role === 'admin') {
      entity = await this.usersService.findOneById(payload.sub);
    } else if (payload.role === 'partner') {
      entity = await this.partnersService.findOneById(payload.sub);
    }

    if (!entity) {
      console.error("==> JwtStrategy: Об'єкт не знайдено за ID. Це помилка.");
      throw new UnauthorizedException();
    }

    console.log("==> JwtStrategy: Автентифікація успішна. Знайдено об'єкт:", entity);
    return { ...entity, role: payload.role };
  }
}