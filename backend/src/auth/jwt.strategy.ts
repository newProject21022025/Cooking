// src/auth/jwt.strategy.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UsersService } from '../users/users.service';
import { ConfigService } from '@nestjs/config'; 

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private usersService: UsersService,
    private configService: ConfigService, 
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET')!, 
    });
  }

  async validate(payload: { sub: string; email: string }) {
    console.log(`Спроба автентифікації користувача: ${payload.email}`); 
    const user = await this.usersService.findOneById(payload.sub);
    if (!user) {
        console.log(`Користувач ${payload.email} не знайдений.`); 
        throw new UnauthorizedException();
    }
    console.log(`Користувач ${payload.email} успішно автентифіковано.`); 
    return user;
  }
}
