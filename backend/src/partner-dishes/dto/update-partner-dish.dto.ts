// src/partner-dishes/dto/update-partner-dish.dto.ts

import { PartialType } from '@nestjs/mapped-types';
import { CreatePartnerDishDto } from './create-partner-dish.dto';

export class UpdatePartnerDishDto extends PartialType(CreatePartnerDishDto) {}
