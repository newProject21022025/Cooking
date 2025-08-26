// src/auth/auth.controller.ts

import { Controller, Post, Body, HttpCode, HttpStatus, Get, Request, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto'; 
import { JwtAuthGuard } from './jwt-auth.guard';
import { UsersService } from '../users/users.service';
import { PartnersService } from '../partners/partners.service';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private usersService: UsersService,
    private partnersService: PartnersService,
  ) {}

  @HttpCode(HttpStatus.OK)
  @Post('login')
  async signIn(@Body() loginDto: LoginDto) {
    console.log("==> AuthController: POST /auth/login отримано запит");
    console.log("==> AuthController: Тіло запиту:", loginDto);

    try {
      const result = await this.authService.login(loginDto.email, loginDto.password);
      console.log("==> AuthController: Login успішний, повертаємо дані");
      return result;
    } catch (err) {
      console.error("==> AuthController: Login помилка:", err.message);
      throw err;
    }
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  async getProfile(@Request() req) {
    console.log("==> AuthController: GET /auth/profile, користувач:", req.user);

    const { id, role } = req.user;

    if (role === 'user' || role === 'admin') {
      return this.usersService.findOneById(id);
    }

    if (role === 'partner') {
      return this.partnersService.findOneById(id);
    }
  }
}
