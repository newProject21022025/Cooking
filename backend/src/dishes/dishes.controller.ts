// src/dishes/dishes.controller.ts

import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Patch,
  Delete,
  Query,
} from '@nestjs/common';
import { DishesService } from './dishes.service';
import { CreateDishDto } from './dto/create-dish.dto';
import { UpdateDishDto } from './dto/update-dish.dto';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UseGuards, Req, ForbiddenException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UserRole } from '../users/dto/create-user.dto';

@Controller('dishes')
export class DishesController {
  constructor(private readonly dishesService: DishesService) {}

  // ✅ ПЕРЕНЕСЕНІ МАРШРУТИ ВГОРУ ДЛЯ УНИКНЕННЯ КОНФЛІКТУ

  @UseGuards(AuthGuard('jwt'))
  @Get('comments')
  async findAllComments(@Req() req) {
    const user = req.user as { role: UserRole };
    if (user.role !== 'admin') {
      throw new ForbiddenException('Тільки адміністратори можуть отримати доступ до цієї інформації.');
    }
    return this.dishesService.getAllComments();
  }

  @Get('search')
  async search(@Query('query') query: string) {
    if (!query) {
      return this.dishesService.getAllDishes();
    }
    return this.dishesService.searchDishes(query);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete('comment/:id')
  async deleteComment(@Param('id') id: number, @Req() req) {
    const user = req.user as { id: string; role: UserRole };
    const comment = await this.dishesService.getCommentById(id);

    if (comment.user_id !== user.id && user.role !== 'admin') {
      throw new ForbiddenException('Ви не можете видалити цей коментар.');
    }
    return this.dishesService.deleteComment(id);
  }

  // ✅ ІСНУЮЧІ МАРШРУТИ ЗАЛИШИЛИСЯ НА МІСЦІ

  @Post()
  async create(@Body() createDishDto: CreateDishDto) {
    return this.dishesService.createDish(createDishDto);
  }

  @Get()
  async findAll(@Query('is_selected') isSelected?: string) {
    const isSelectedBool = isSelected === 'true' ? true : undefined;
    return this.dishesService.getAllDishes(isSelectedBool);
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    return this.dishesService.getDishById(id);
  }

  @Patch(':id')
  async update(@Param('id') id: number, @Body() updateDishDto: UpdateDishDto) {
    return this.dishesService.updateDish(id, updateDishDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: number) {
    return this.dishesService.deleteDish(id);
  }

  @Patch(':id/select')
  async select(@Param('id') id: number) {
    return this.dishesService.selectDish(id);
  }

  @Patch(':id/unselect')
  async unselect(@Param('id') id: number) {
    return this.dishesService.unselectDish(id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('comment')
  async addComment(@Body() createCommentDto: CreateCommentDto, @Req() req) {
    const userId = req.user.id;
    return this.dishesService.addComment({
      ...createCommentDto,
      user_id: userId,
    });
  }
}