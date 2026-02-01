import { Injectable } from '@nestjs/common';
import {
  OrderCreateInput,
  OrderUpdateInput,
} from 'src/generated/prisma/models';
import { PrismaService } from 'src/prismaservice/prisma.service';

@Injectable()
export class OrderService {
  constructor(private db: PrismaService) {}

  async create(createOrderDto: OrderCreateInput) {
    return await this.db.order.create({ data: createOrderDto });
  }

  async findAll() {
    return await this.db.order.findMany({
      include: {
        customer: true,
        orderStatus: true,
        orderItems: { include: { item: true } },
      },
    });
  }

  async findOne(id: string) {
    return await this.db.order.findUnique({
      where: { id },
      include: {
        customer: true,
        orderStatus: true,
        orderItems: { include: { item: true } },
      },
    });
  }

  async update(id: string, updateOrderDto: OrderUpdateInput) {
    return await this.db.order.update({
      where: { id },
      data: updateOrderDto,
    });
  }

  async remove(id: string) {
    return await this.db.order.delete({ where: { id } });
  }
}
