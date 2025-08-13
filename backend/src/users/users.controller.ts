// src/users/users.controller.ts

import { Body,  Post } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { Controller, Get, Request, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

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
}
