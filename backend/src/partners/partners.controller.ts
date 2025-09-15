// src/partners/partners.controller.ts
import {
  Controller,
  Post,
  Body,
  Get,
  Delete,
  Patch,
  Param,
} from '@nestjs/common';
import { PartnersService } from './partners.service';
import { CreatePartnerDto } from './dto/create-partner.dto';
import { UpdatePartnerDto } from './dto/update-partner.dto';
import { ChangePartnerPasswordDto } from './dto/change-partner-password.dto';

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

  // ✅ Додаємо ендпоінт для отримання партнера по ID
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.partnersService.findOneById(id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.partnersService.deletePartner(id);
  }

  @Patch(':id/block')
  toggleBlock(@Param('id') id: string) {
    return this.partnersService.toggleBlockPartner(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdatePartnerDto) {
    return this.partnersService.updatePartner(id, dto);
  }

  @Patch(':id/change-password')
  async changePassword(
    @Param('id') id: string,
    @Body() body: { currentPassword: string; newPassword: string }
  ) {
    const { currentPassword, newPassword } = body;
    return this.partnersService.changePassword(id, currentPassword, newPassword);
  }
}
