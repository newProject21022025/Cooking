import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { SupabaseService } from '../supabase/supabase.service';

@Module({
  providers: [OrdersService, SupabaseService],
  controllers: [OrdersController],
})
export class OrdersModule {}
