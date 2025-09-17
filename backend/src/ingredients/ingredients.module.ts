// src/ingredients/ingredients.module.ts

import { Module } from '@nestjs/common';
import { IngredientsController } from './ingredients.controller';
import { IngredientsService } from './ingredients.service';
import { SupabaseModule } from '../supabase/supabase.module';

@Module({
  imports: [SupabaseModule],
  controllers: [IngredientsController], // ✅ Must be listed here
  providers: [IngredientsService],
})
export class IngredientsModule {}