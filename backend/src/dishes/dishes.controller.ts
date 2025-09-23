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

@Controller('dishes')
export class DishesController {
  constructor(private readonly dishesService: DishesService) {}

  @Post()
  async create(@Body() createDishDto: CreateDishDto) {
    return this.dishesService.createDish(createDishDto);
  }

  // ✅ Додаємо новий маршрут для пошуку
  @Get('search')
  async search(@Query('query') query: string) {
    if (!query) {
      return this.dishesService.getAllDishes();
    }
    return this.dishesService.searchDishes(query);
  }

  @Get()
  async findAll(@Query('is_selected') isSelected?: string) {
    // ✅ Перевіряємо, чи передано параметр is_selected
    // Значення 'true' перетворюється на булевий тип true, інакше - undefined
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
}
