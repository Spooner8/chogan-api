import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { OrderItemService } from './order-item.service';
import type {
  OrderItemCreateInput,
  OrderItemUpdateInput,
} from 'src/generated/prisma/models';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/generated/prisma/enums';
import { UseGuards } from '@nestjs/common';

@Controller('order-item')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN, Role.USER)
export class OrderItemController {
  constructor(private readonly orderItemService: OrderItemService) {}

  @Post()
  async create(@Body() createOrderItemDto: OrderItemCreateInput) {
    return await this.orderItemService.create(createOrderItemDto);
  }

  @Get()
  async findAll() {
    return await this.orderItemService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.orderItemService.findOne(id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateOrderItemDto: OrderItemUpdateInput,
  ) {
    return await this.orderItemService.update(id, updateOrderItemDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.orderItemService.remove(id);
  }
}
