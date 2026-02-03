import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { OrderService } from './order.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/generated/prisma/enums';
import { UseGuards } from '@nestjs/common';
import type {
  OrderUncheckedCreateInput,
  OrderUncheckedUpdateInput,
} from 'src/generated/prisma/models/Order';

type CreateOrderDto = Omit<OrderUncheckedCreateInput, 'orderItems'> & {
  items?: Array<{
    itemId: string;
    quantity: number;
    price: number;
    discount?: number;
  }>;
};

type UpdateOrderDto = Partial<Omit<OrderUncheckedUpdateInput, 'orderItems'>> & {
  items?: Array<{
    itemId: string;
    quantity: number;
    price: number;
    discount?: number;
  }>;
};

@Controller('order')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN, Role.USER)
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  async create(@Body() createOrderDto: CreateOrderDto) {
    return await this.orderService.create(createOrderDto);
  }

  @Get()
  async findAll() {
    return await this.orderService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.orderService.findOne(id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateOrderDto: UpdateOrderDto,
  ) {
    return await this.orderService.update(id, updateOrderDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.orderService.remove(id);
  }

  @Post(':id/book')
  @Roles(Role.ADMIN)
  async bookOrder(@Param('id') id: string) {
    return await this.orderService.bookOrder(id);
  }

  @Post(':id/unbook')
  @Roles(Role.ADMIN)
  async unbookOrder(@Param('id') id: string) {
    return await this.orderService.unbookOrder(id);
  }
}
