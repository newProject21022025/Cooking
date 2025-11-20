// src/articles/articles.module.ts

import { Module } from '@nestjs/common';
import { ArticlesService } from './articles.service';
import { ArticlesController } from './articles.controller';
import { SupabaseModule } from '../supabase/supabase.module';

@Module({
  imports: [SupabaseModule],  // ← щоб ArticlesService мав доступ до SupabaseService
  controllers: [ArticlesController],
  providers: [ArticlesService],
  exports: [ArticlesService], // ← якщо потрібно використовувати в інших модулях
})
export class ArticlesModule {}
