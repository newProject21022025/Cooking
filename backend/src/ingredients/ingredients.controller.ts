// src/ingredients/ingredients.controller.ts
import { Controller, Post, Body, Patch, Param, Delete, Get, Query } from '@nestjs/common';
import { IngredientsService } from './ingredients.service';
import { CreateIngredientDto } from './dto/create-ingredient.dto';
import { UpdateIngredientDto } from './dto/update-ingredient.dto';

@Controller('ingredients')
export class IngredientsController {
  constructor(private readonly ingredientsService: IngredientsService) {}

  @Post()
  create(@Body() createIngredientDto: CreateIngredientDto) {
    return this.ingredientsService.create(createIngredientDto);
  }

  // ✅ Новий маршрут для пошуку за назвою
  @Get('search')
  findOneByName(@Query('name') name: string) {
    return this.ingredientsService.findOneByName(name);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateIngredientDto: UpdateIngredientDto) {
    return this.ingredientsService.update(id, updateIngredientDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.ingredientsService.remove(id);
  }
  @Get()
  findAll() {
    return this.ingredientsService.findAll();
  }
}