// src/mailer/mailer.service.ts

import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { Order } from '../orders/orders.service';

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
    // ... (існуючий метод)
  }

  async sendOrderConfirmation(order: Order) {
    // ➡️ Формуємо HTML-вміст для товарів у замовленні
    const itemsHtml = order.items.map(item => `
      <tr style="border-bottom: 1px solid #eee;">
        <td style="padding: 10px 0;">
          <img src="${item.photo}" alt="${item.name}" style="width: 50px; height: 50px; object-fit: cover; border-radius: 5px; margin-right: 10px;">
          <span style="font-size: 16px; font-weight: 600;">${item.name}</span>
        </td>
        <td style="padding: 10px 0; text-align: center;">${item.quantity}</td>
        <td style="padding: 10px 0; text-align: right; font-weight: 600;">${item.price} грн</td>
      </tr>
    `).join('');

    // ➡️ Основний HTML-шаблон листа
    const htmlContent = `
      <div style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px;">
        <div style="max-width: 600px; margin: auto; background-color: #fff; padding: 20px; border-radius: 8px; box-shadow: 0 0 10px rgba(0,0,0,0.1);">
          <div style="text-align: center; border-bottom: 2px solid #ff4500; padding-bottom: 10px;">
            <h1 style="color: #333;">Дякуємо за ваше замовлення!</h1>
            <p style="color: #666; font-size: 16px;">Ваше замовлення успішно прийнято та обробляється.</p>
          </div>
          
          <div style="padding: 20px 0;">
            <p style="font-size: 16px; color: #555;"><strong>Номер замовлення:</strong> <span style="color: #ff4500;">${order.orderNumber}</span></p>
            <p style="font-size: 16px; color: #555;"><strong>Загальна сума:</strong> <span style="color: #ff4500;">${order.totalSum} грн</span></p>
            <p style="font-size: 16px; color: #555;"><strong>Адреса доставки:</strong> ${order.address}</p>
          </div>
          
          <div style="padding: 10px; background-color: #f9f9f9; border-radius: 8px;">
            <h2 style="color: #ff4500; margin-top: 0;">Деталі замовлення:</h2>
            <table style="width: 100%; border-collapse: collapse;">
              <thead>
                <tr style="background-color: #eee;">
                  <th style="padding: 10px; text-align: left;">Товар</th>
                  <th style="padding: 10px; text-align: center;">Кількість</th>
                  <th style="padding: 10px; text-align: right;">Ціна</th>
                </tr>
              </thead>
              <tbody>
                ${itemsHtml}
              </tbody>
            </table>
          </div>

          <div style="text-align: center; margin-top: 20px; color: #999; font-size: 12px;">
            <p>Очікуйте на дзвінок від нашого менеджера для підтвердження замовлення.</p>
            <p>З повагою, команда Food Delivery</p>
          </div>
        </div>
      </div>
    `;

    await this.transporter.sendMail({
      from: `"Food Delivery" <${process.env.MAIL_USER}>`,
      to: order.email,
      subject: `Ваше замовлення №${order.orderNumber} успішно створено`,
      html: htmlContent,
    });
  }
}