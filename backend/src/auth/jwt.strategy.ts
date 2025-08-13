// src/auth/jwt.strategy.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UsersService } from '../users/users.service';
import { ConfigService } from '@nestjs/config'; // ✨ Импортируем ConfigService

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private usersService: UsersService,
    private configService: ConfigService, // ✨ Внедряем ConfigService
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET')!, // ✨ Добавлено "!" для утверждения, что это не undefined
    });
  }

  async validate(payload: { sub: string; email: string }) {
    console.log(`Попытка аутентификации пользователя: ${payload.email}`); // ✨ Добавили лог
    const user = await this.usersService.findOneById(payload.sub);
    if (!user) {
        console.log(`Пользователь ${payload.email} не найден.`); // ✨ Добавили лог
        throw new UnauthorizedException();
    }
    console.log(`Пользователь ${payload.email} успешно аутентифицирован.`); // ✨ Добавили лог
    return user;
  }
}
