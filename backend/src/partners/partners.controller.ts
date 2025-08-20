// src/partners/partners.controller.ts

import { Controller, Post, Body, Get } from '@nestjs/common';
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
}
