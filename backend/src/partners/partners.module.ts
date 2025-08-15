import { Module } from '@nestjs/common';
import { PartnersService } from './partners.service';
import { PartnersController } from './partners.controller';
import { SupabaseService } from '../supabase/supabase.service';

@Module({
  controllers: [PartnersController],
  providers: [PartnersService, SupabaseService],
  exports: [PartnersService],
})
export class PartnersModule {}
