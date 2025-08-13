// src/auth/auth.module.ts
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { UsersModule } from '../users/users.module';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './jwt.strategy';
import { ConfigModule, ConfigService } from '@nestjs/config'; // ✨ Импортируем ConfigModule и ConfigService

@Module({
  imports: [
    UsersModule,
    PassportModule,
    // ✨ Используем registerAsync для получения секрета из ConfigService
    JwtModule.registerAsync({
      imports: [ConfigModule], // Обязательно импортируем ConfigModule сюда
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'), // Получаем секрет из переменной окружения
        signOptions: { expiresIn: '7d' },
      }),
      inject: [ConfigService], // Указываем, что нам нужно внедрить ConfigService
    }),
  ],
  providers: [AuthService, JwtStrategy],
  controllers: [AuthController],
})
export class AuthModule {}
