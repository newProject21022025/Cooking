import { Module } from '@nestjs/common';
import { PartnerDishesService } from './partner-dishes.service';
import { PartnerDishesController } from './partner-dishes.controller';
import { SupabaseService } from '../supabase/supabase.service';

@Module({
  controllers: [PartnerDishesController],
  providers: [PartnerDishesService, SupabaseService],
  exports: [PartnerDishesService],
})
export class PartnerDishesModule {}
