// src/mailer/mailer.service.ts

import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailerService {
  private transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    });
  }

  async sendNewPassword(email: string, newPassword: string) {
    await this.transporter.sendMail({
      from: `"Support" <${process.env.MAIL_USER}>`,
      to: email,
      subject: 'Ваш новий пароль',
      text: `Ваш новий пароль: ${newPassword}`,
      html: `<p>Ваш новий пароль: <b>${newPassword}</b></p>`,
    });
  }
}
