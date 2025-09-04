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

  const allowedOrigins = [
    // 'https://urban-fusion-amber.vercel.app',
    // 'https://urban-fusion-5fee.vercel.app',
    'http://localhost:3000',
    'http://localhost:3001',
  ];

  app.enableCors({
    origin: allowedOrigins,
    credentials: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: 'Content-Type,Authorization',
    exposedHeaders: ['Authorization'],
  });

  const port = process.env.PORT || 3000;
  await app.listen(port, '0.0.0.0', () => {
    console.log(`Server is running on port ${port}`);
  });

  
  // await app.listen(3000);
}

bootstrap();

