import { Injectable } from '@nestjs/common';
import {
  OrderItemCreateInput,
  OrderItemUpdateInput,
} from 'src/generated/prisma/models';
import { PrismaService } from 'src/prismaservice/prisma.service';

@Injectable()
export class OrderItemService {
  constructor(private db: PrismaService) {}

  async create(createOrderItemDto: OrderItemCreateInput) {
    return await this.db.orderItem.create({ data: createOrderItemDto });
  }

  async findAll() {
    return await this.db.orderItem.findMany({
      include: { order: true, item: true },
    });
  }

  async findOne(id: string) {
    return await this.db.orderItem.findUnique({
      where: { id },
      include: { order: true, item: true },
    });
  }

  async update(id: string, updateOrderItemDto: OrderItemUpdateInput) {
    return await this.db.orderItem.update({
      where: { id },
      data: updateOrderItemDto,
    });
  }

  async remove(id: string) {
    return await this.db.orderItem.delete({ where: { id } });
  }
}
