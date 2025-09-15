// src/partners/dto/change-partner-password.dto.ts
import { IsString, MinLength } from 'class-validator';

export class ChangePartnerPasswordDto {
  @IsString()
  @MinLength(5)
  currentPassword: string;

  @IsString()
  @MinLength(5)
  newPassword: string;
}
