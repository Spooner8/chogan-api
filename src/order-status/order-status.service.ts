import { Injectable } from '@nestjs/common';
import { OrderStatus } from 'src/generated/prisma/client';
import {
  OrderStatusCreateInput,
  OrderStatusUpdateInput,
} from 'src/generated/prisma/models';
import { PrismaService } from 'src/prismaservice/prisma.service';

@Injectable()
export class OrderStatusService {
  constructor(private db: PrismaService) {}

  async create(createOrderStatusDto: OrderStatusCreateInput) {
    return await this.db.orderStatus.create({ data: createOrderStatusDto });
  }

  async findAll() {
    return await this.db.orderStatus.findMany();
  }

  async findOne(id: string) {
    return await this.db.orderStatus.findUnique({ where: { id } });
  }

  async update(id: string, updateOrderStatusDto: OrderStatusUpdateInput) {
    return await this.db.orderStatus.update({
      where: { id },
      data: updateOrderStatusDto,
    });
  }

  async remove(id: string) {
    const orderStatusToDelete: OrderStatus | null =
      await this.db.orderStatus.findUnique({
        where: { id },
      });
    if (!orderStatusToDelete) {
      throw new Error('OrderStatus not found');
    }

    orderStatusToDelete.deletedAt = new Date();

    return await this.db.orderStatus.update({
      where: { id },
      data: orderStatusToDelete,
    });
  }
}
