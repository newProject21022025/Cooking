// src/orders/orders.module.ts

// src/orders/orders.module.ts

import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { SupabaseModule } from '../supabase/supabase.module'; // ⬅️ Імпортуйте SupabaseModule
import { MailerModule } from '../mailer/mailer.module';

@Module({
  imports: [
    SupabaseModule, // ⬅️ Імпортуйте SupabaseModule тут
    MailerModule    // ⬅️ Імпортуйте MailerModule тут
  ],
  providers: [OrdersService], // ⬅️ Залишаємо лише провайдери, оголошені в цьому модулі
  controllers: [OrdersController],
})
export class OrdersModule {}



// import { Module } from '@nestjs/common';
// import { OrdersService } from './orders.service';
// import { OrdersController } from './orders.controller';
// import { SupabaseService } from '../supabase/supabase.service';
// import { MailerModule } from '../mailer/mailer.module';

// @Module({
//   providers: [OrdersService, SupabaseService],
//   controllers: [OrdersController],
// })
// export class OrdersModule {}
