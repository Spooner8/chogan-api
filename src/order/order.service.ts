import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prismaservice/prisma.service';

interface OrderItem {
  itemId: string;
  quantity: number;
  price: number;
  discount?: number;
}

interface CreateOrderDto {
  customerId: string;
  orderStatusId: string;
  deliveryDate?: Date | string;
  items?: OrderItem[];
}

interface UpdateOrderDto {
  customerId?: string;
  orderStatusId?: string;
  deliveryDate?: Date | string;
  items?: OrderItem[];
}

@Injectable()
export class OrderService {
  constructor(private db: PrismaService) {}

  async create(createOrderDto: CreateOrderDto) {
    const { items, ...orderData } = createOrderDto;

    return await this.db.order.create({
      data: {
        ...orderData,
        orderItems: items
          ? {
              create: items.map((item) => ({
                itemId: item.itemId,
                quantity: item.quantity,
                price: item.price,
                discount: item.discount || 0,
              })),
            }
          : undefined,
      },
      include: {
        customer: true,
        orderStatus: true,
        orderItems: {
          include: {
            item: true,
          },
        },
      },
    });
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

  async update(id: string, updateOrderDto: UpdateOrderDto) {
    const { items, ...orderData } = updateOrderDto;

    return await this.db.order.update({
      where: { id },
      data: {
        ...orderData,
        orderItems: items
          ? {
              deleteMany: {},
              create: items.map((item) => ({
                itemId: item.itemId,
                quantity: item.quantity,
                price: item.price,
                discount: item.discount || 0,
              })),
            }
          : undefined,
      },
      include: {
        customer: true,
        orderStatus: true,
        orderItems: {
          include: {
            item: true,
          },
        },
      },
    });
  }

  async remove(id: string) {
    return await this.db.order.delete({ where: { id } });
  }
}
