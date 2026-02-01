import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { OrderStatusService } from './order-status.service';
import type {
  OrderStatusCreateInput,
  OrderStatusUpdateInput,
} from 'src/generated/prisma/models';

@Controller('order-status')
export class OrderStatusController {
  constructor(private readonly orderStatusService: OrderStatusService) {}

  @Post()
  async create(@Body() createOrderStatusDto: OrderStatusCreateInput) {
    return await this.orderStatusService.create(createOrderStatusDto);
  }

  @Get()
  async findAll() {
    return await this.orderStatusService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.orderStatusService.findOne(id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateOrderStatusDto: OrderStatusUpdateInput,
  ) {
    return await this.orderStatusService.update(id, updateOrderStatusDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.orderStatusService.remove(id);
  }
}
