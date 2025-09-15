// src/auth/auth.service.ts
import { Injectable, UnauthorizedException, NotFoundException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { PartnersService } from '../partners/partners.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { MailerService } from '../mailer/mailer.service';


@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private partnersService: PartnersService,
    private jwtService: JwtService,
    private mailerService: MailerService,
  ) {}

  async login(email: string, password: string) {
    console.log("==> AuthService: login почався для email:", email);
  
    let entity;
  
    entity = await this.usersService.findOneByEmail(email);
    if (!entity) {
      entity = await this.partnersService.findOneByEmail(email);
    }
  
    if (!entity) {
      throw new UnauthorizedException('Невірні дані (користувача не знайдено)');
    }
  
    const passwordMatch = await bcrypt.compare(password, entity.password);
    if (!passwordMatch) {
      throw new UnauthorizedException('Невірні дані (пароль невірний)');
    }
  
    const payload = {
      sub: entity.id,
      email: entity.email,
      role: entity.role, // ⚡ реальна роль з бази
    };
  
    const access_token = this.jwtService.sign(payload);
  
    return {
      access_token,
      user: {
        id: entity.id,
        email: entity.email,
        firstName: entity.firstName,
        lastName: entity.lastName,
        role: entity.role, // ⚡ реальна роль з бази
      },
    };
  }
  async resetPassword(email: string) {
    let entity = await this.usersService.findOneByEmail(email);
    let type: 'user' | 'partner' = 'user';

    if (!entity) {
      entity = await this.partnersService.findOneByEmail(email);
      type = 'partner';
    }

    if (!entity) {
      throw new NotFoundException('Користувача з таким email не знайдено');
    }

    // Генеруємо новий пароль
    const newPassword = Math.random().toString(36).slice(-8);

    // Хешуємо
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Оновлюємо у відповідному сервісі
    if (type === 'user') {
      await this.usersService.updatePassword(entity.id, hashedPassword);
    } else {
      await this.partnersService.updatePassword(entity.id, hashedPassword);
    }

    // Надсилаємо поштою
    await this.mailerService.sendNewPassword(email, newPassword);

    return { message: 'Новий пароль надіслано на пошту' };
  }
}
  
