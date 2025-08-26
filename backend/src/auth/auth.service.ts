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
    console.log("==> AuthService: login почався для email:", email);

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
      console.warn("==> AuthService: Користувача не знайдено");
      throw new UnauthorizedException('Невірні дані (користувача не знайдено)');
    }

    console.log("==> AuthService: Знайдено об'єкт. Його ID:", entity.id);

    const passwordMatch = await bcrypt.compare(password, entity.password);
    if (!passwordMatch) {
      console.warn("==> AuthService: Пароль невірний для ID:", entity.id);
      throw new UnauthorizedException('Невірні дані (пароль невірний)');
    }

    const payload = {
      sub: entity.id,
      email: entity.email,
      role: role
    };

    console.log("==> AuthService: Payload для токена:", payload);

    const access_token = this.jwtService.sign(payload);
    console.log("==> AuthService: Токен згенеровано");

    return {
      access_token,
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
