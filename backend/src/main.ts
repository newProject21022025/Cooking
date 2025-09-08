// main.ts

import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, 
      forbidNonWhitelisted: true, 
      transform: true, 
      skipMissingProperties: true,
    }),
  );

   // 🔁 Підтримка :locale як глобального параметра
  //  app.setGlobalPrefix(':locale');

  // const allowedOrigins = [
  //   'https://cooking-beta.vercel.app',
  //   'https://cooking-ujfo.vercel.app',    
  //   'http://localhost:3000',
  //   'http://localhost:3001',
  // ];

  // app.enableCors({
  //   origin: allowedOrigins,
  //   credentials: true,
  //   methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
  //   allowedHeaders: 'Content-Type,Authorization',
  //   exposedHeaders: ['Authorization'],
  // });
  
  const allowedOrigins = [
    'https://cooking-beta.vercel.app',
    'https://cooking-ujfo.vercel.app', // ✅ без пробілу
    'http://localhost:3000',
    'http://localhost:3001',
  ];
  
  app.enableCors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error(`CORS blocked for origin: ${origin}`));
      }
    },
    credentials: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
    exposedHeaders: ['Authorization'],
  });
  

  const port = process.env.PORT || 3000;
  await app.listen(port, '0.0.0.0', () => {
    console.log(`Server is running on port ${port}`);
  });

  
  // await app.listen(3000);
}

bootstrap();

