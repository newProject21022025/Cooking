// src/orders/orders.controller.ts

import { Controller, Post, Body, Get, Param, Delete, Patch, HttpException, HttpStatus } from '@nestjs/common';
import { OrdersService } from './orders.service';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  async create(@Body() orderData: any) {
    try {
      const order = await this.ordersService.createOrder(orderData);
      return {
        success: true,
        orderNumber: order.orderNumber,
        message: 'Замовлення успішно створено'
      };
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          message: error.message
        },
        HttpStatus.BAD_REQUEST
      );
    }
  }

  @Get()
  async findAll() {
    try {
      const orders = await this.ordersService.getOrders();
      return orders;
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          message: error.message
        },
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Get(':orderNumber')
  async findOne(@Param('orderNumber') orderNumber: string) {
    const order = await this.ordersService.getOrderByNumber(orderNumber);
    if (!order) {
      throw new HttpException(
        {
          success: false,
          message: 'Замовлення не знайдено'
        },
        HttpStatus.NOT_FOUND
      );
    }
    return order;
  }

  // НОВИЙ ЕНДПОІНТ: Видалення замовлення
  @Delete(':orderNumber')
  async delete(@Param('orderNumber') orderNumber: string) {
    try {
      await this.ordersService.deleteOrder(orderNumber);
      return {
        success: true,
        message: `Замовлення ${orderNumber} успішно видалено`
      };
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          message: error.message
        },
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  // Додатковий ендпоінт: Оновлення статусу
  @Patch(':orderNumber/status')
  async updateStatus(
    @Param('orderNumber') orderNumber: string,
    @Body() body: { status: string }
  ) {
    try {
      const updatedOrder = await this.ordersService.updateOrderStatus(orderNumber, body.status);
      if (!updatedOrder) {
        throw new HttpException(
          {
            success: false,
            message: 'Замовлення не знайдено'
          },
          HttpStatus.NOT_FOUND
        );
      }
      return {
        success: true,
        message: 'Статус замовлення оновлено',
        order: updatedOrder
      };
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          message: error.message
        },
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
}