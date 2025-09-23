// src/partner-dishes/partner-dishes.controller.ts

import { Controller, Post, Body, Patch, Param, Delete, Get, Query } from '@nestjs/common';
import { PartnerDishesService } from './partner-dishes.service';
import { CreatePartnerDishDto } from './dto/create-partner-dish.dto';
import { UpdatePartnerDishDto } from './dto/update-partner-dish.dto';

@Controller('partner-dishes')
export class PartnerDishesController {
  constructor(private readonly partnerDishesService: PartnerDishesService) {}

  @Post()
  addDish(@Body() dto: CreatePartnerDishDto) {
    return this.partnerDishesService.addDish(dto);
  }

  // ✅ Розміщуємо пов'язані маршрути разом, від найбільш специфічного до загального
  @Get('menu/search/:partnerId')
  searchPartnerDishes(@Param('partnerId') partnerId: string, @Query('query') query: string) {
    if (!query) {
      return this.partnerDishesService.getPartnerMenu(partnerId);
    }
    return this.partnerDishesService.searchPartnerDishes(partnerId, query);
  }

  @Get('menu/:partnerId')
  getPartnerMenu(@Param('partnerId') partnerId: string) {
    return this.partnerDishesService.getPartnerMenu(partnerId);
  }

  @Patch(':id')
  updateDish(@Param('id') id: string, @Body() dto: UpdatePartnerDishDto) {
    return this.partnerDishesService.updateDish(id, dto);
  }

  @Delete(':id')
  deleteDish(@Param('id') id: string) {
    return this.partnerDishesService.deleteDish(id);
  }
}