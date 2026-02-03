import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prismaservice/prisma.service';
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
    const { items, customerId, orderStatusId, ...orderData } = updateOrderDto;

    return await this.db.order.update({
      where: { id },
      data: {
        ...orderData,
        ...(customerId && typeof customerId === 'string' ? { customerId } : {}),
        ...(orderStatusId && typeof orderStatusId === 'string'
          ? { orderStatusId }
          : {}),
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

  async bookOrder(id: string) {
    const order = await this.db.order.findUnique({
      where: { id },
      include: { orderItems: true },
    });

    if (!order) {
      throw new Error('Order not found');
    }

    if (order.bookedAt) {
      throw new Error('Order is already booked');
    }

    // Check if sufficient inventory is available
    for (const item of order.orderItems) {
      const currentItem = await this.db.item.findUnique({
        where: { id: item.itemId },
      });

      if (!currentItem || currentItem.inventory < item.quantity) {
        throw new Error(
          `Insufficient inventory for item ${item.itemId}. Available: ${currentItem?.inventory || 0}, Required: ${item.quantity}`,
        );
      }
    }

    // Update inventory for all items in the order
    await this.db.$transaction([
      // Mark order as booked
      this.db.order.update({
        where: { id },
        data: { bookedAt: new Date() },
      }),
      // Decrease inventory for each item
      ...order.orderItems.map((item) =>
        this.db.item.update({
          where: { id: item.itemId },
          data: { inventory: { decrement: item.quantity } },
        }),
      ),
    ]);

    return await this.findOne(id);
  }

  async unbookOrder(id: string) {
    const order = await this.db.order.findUnique({
      where: { id },
      include: { orderItems: true },
    });

    if (!order) {
      throw new Error('Order not found');
    }

    if (!order.bookedAt) {
      throw new Error('Order is not booked');
    }

    // Revert inventory for all items in the order
    await this.db.$transaction([
      // Mark order as unbooked
      this.db.order.update({
        where: { id },
        data: { bookedAt: null },
      }),
      // Increase inventory for each item (return to stock)
      ...order.orderItems.map((item) =>
        this.db.item.update({
          where: { id: item.itemId },
          data: { inventory: { increment: item.quantity } },
        }),
      ),
    ]);

    return await this.findOne(id);
  }
}
