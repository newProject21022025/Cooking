// src/users/users.controller.ts

import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { Controller, Get, Request, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Param, Patch, Body, Delete, Post } from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadedFile, UseInterceptors } from '@nestjs/common';


@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() dto: CreateUserDto) {
    return this.usersService.createUser(dto);
  }
  @UseGuards(AuthGuard('jwt'))
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }
  @Patch(':id')
  async updateUser(@Param('id') id: string, @Body() dto: UpdateUserDto) {
    return this.usersService.updateUser(id, dto);
  }
  @Delete(':id')
  async deleteUser(@Param('id') id: string) {
    return this.usersService.deleteUser(id);
  }
  @Patch(':id/block')
async blockUser(@Param('id') id: string) { // Видалено @Body() dto
  return this.usersService.setBlockStatus(id, true);
}

@Patch(':id/unblock')
async unblockUser(@Param('id') id: string) { // Видалено @Body() dto
  return this.usersService.setBlockStatus(id, false);
}
  @UseGuards(AuthGuard('jwt'))
  @Get()
  async getAllUsers() {
    return this.usersService.findAll();
  }

  @UseGuards(AuthGuard('jwt')) // Тільки для авторизованих користувачів
  @Post(':id/avatar')
  @UseInterceptors(FileInterceptor('file')) // 'file' - ім'я поля у формі, де передається файл
  async uploadAvatar(
    @Param('id') userId: string,
    @UploadedFile() file: Express.Multer.File // Декоратор для отримання файлу
  ) {
    // Передаємо обробку файлу сервісу
    return this.usersService.uploadUserAvatar(userId, file);
  }
}

