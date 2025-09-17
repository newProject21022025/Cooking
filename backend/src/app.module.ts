// app.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { SupabaseModule } from './supabase/supabase.module';
import { AuthModule } from './auth/auth.module';
import { DishesModule } from './dishes/dishes.module';
import { PartnersModule } from './partners/partners.module';
import { PartnerDishesModule } from './partner-dishes/partner-dishes.module';
import { OrdersModule } from './orders/orders.module';
import { MailerModule } from './mailer/mailer.module';
import { IngredientsModule } from './ingredients/ingredients.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    SupabaseModule,
    UsersModule,
    AuthModule,
    DishesModule,
    PartnersModule,
    PartnerDishesModule,
    OrdersModule,
    MailerModule,
    IngredientsModule,
  ],
})
export class AppModule {}
