// src/partners/partners.controller.ts

import { Controller, Post, Body, Get, Delete, Patch, Param } from '@nestjs/common';
import { PartnersService } from './partners.service';
import { CreatePartnerDto } from './dto/create-partner.dto';

@Controller('partners')
export class PartnersController {
  constructor(private readonly partnersService: PartnersService) {}

  @Post()
  create(@Body() dto: CreatePartnerDto) {
    return this.partnersService.createPartner(dto);
  }

  @Get()
  findAll() {
    return this.partnersService.getAllPartners();
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.partnersService.deletePartner(id);
  }

    // ✅ новий ендпоінт для блокування / розблокування
    @Patch(':id/block')
    toggleBlock(@Param('id') id: string) {
      return this.partnersService.toggleBlockPartner(id);
    }
    
}
