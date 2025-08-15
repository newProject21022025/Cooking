// src/dishes/dishes.controller.ts

import { Controller, Post, Body, Get, Param, Patch, Delete } from '@nestjs/common';
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

  @Get()
  async findAll() {
    return this.dishesService.getAllDishes();
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    return this.dishesService.getDishById(id);
  }

  @Patch(':id')
async update(
  @Param('id') id: number,
  @Body() updateDishDto: UpdateDishDto
) {
  return this.dishesService.updateDish(id, updateDishDto);
}

@Delete(':id')
async remove(@Param('id') id: number) {
  return this.dishesService.deleteDish(id);
}
}
