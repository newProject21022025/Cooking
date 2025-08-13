import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SupabaseService } from './supabase/supabase.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // робить змінні доступними у всьому додатку
    }),
  ],
  providers: [SupabaseService],
  exports: [SupabaseService],
})
export class AppModule {}

