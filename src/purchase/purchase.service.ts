import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prismaservice/prisma.service';
import type {
  PurchaseUncheckedCreateInput,
  PurchaseUncheckedUpdateInput,
} from 'src/generated/prisma/models/Purchase';

type CreatePurchaseDto = Omit<PurchaseUncheckedCreateInput, 'purchaseItems'> & {
  items?: Array<{
    itemId: string;
    quantity: number;
    price: number;
    discount?: number;
  }>;
};

type UpdatePurchaseDto = Partial<
  Omit<PurchaseUncheckedUpdateInput, 'purchaseItems'>
> & {
  items?: Array<{
    itemId: string;
    quantity: number;
    price: number;
    discount?: number;
  }>;
};

@Injectable()
export class PurchaseService {
  constructor(private db: PrismaService) {}

  async create(createPurchaseDto: CreatePurchaseDto) {
    const { items, ...purchaseData } = createPurchaseDto;

    return await this.db.purchase.create({
      data: {
        ...purchaseData,
        purchaseItems: items
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
        purchaseItems: {
          include: {
            item: true,
          },
        },
        purchaseStatus: true,
      },
    });
  }

  async findAll() {
    return await this.db.purchase.findMany({
      include: {
        purchaseStatus: true,
        purchaseItems: { include: { item: true } },
      },
    });
  }

  async findOne(id: string) {
    return await this.db.purchase.findUnique({
      where: { id },
      include: {
        purchaseStatus: true,
        purchaseItems: { include: { item: true } },
      },
    });
  }

  async update(id: string, updatePurchaseDto: UpdatePurchaseDto) {
    const { items, purchaseStatusId, ...purchaseData } = updatePurchaseDto;

    return await this.db.purchase.update({
      where: { id },
      data: {
        ...purchaseData,
        ...(purchaseStatusId && typeof purchaseStatusId === 'string'
          ? { purchaseStatusId }
          : {}),
        purchaseItems: items
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
        purchaseItems: {
          include: {
            item: true,
          },
        },
        purchaseStatus: true,
      },
    });
  }

  async remove(id: string) {
    return await this.db.purchase.delete({ where: { id } });
  }

  async bookPurchase(id: string) {
    const purchase = await this.db.purchase.findUnique({
      where: { id },
      include: { purchaseItems: true },
    });

    if (!purchase) {
      throw new Error('Purchase not found');
    }

    if (purchase.bookedAt) {
      throw new Error('Purchase is already booked');
    }

    // Update inventory for all items in the purchase
    await this.db.$transaction([
      // Mark purchase as booked
      this.db.purchase.update({
        where: { id },
        data: { bookedAt: new Date() },
      }),
      // Increase inventory for each item
      ...purchase.purchaseItems.map((item) =>
        this.db.item.update({
          where: { id: item.itemId },
          data: { inventory: { increment: item.quantity } },
        }),
      ),
    ]);

    return await this.findOne(id);
  }

  async unbookPurchase(id: string) {
    const purchase = await this.db.purchase.findUnique({
      where: { id },
      include: { purchaseItems: true },
    });

    if (!purchase) {
      throw new Error('Purchase not found');
    }

    if (!purchase.bookedAt) {
      throw new Error('Purchase is not booked');
    }

    // Revert inventory for all items in the purchase
    await this.db.$transaction([
      // Mark purchase as unbooked
      this.db.purchase.update({
        where: { id },
        data: { bookedAt: null },
      }),
      // Decrease inventory for each item
      ...purchase.purchaseItems.map((item) =>
        this.db.item.update({
          where: { id: item.itemId },
          data: { inventory: { decrement: item.quantity } },
        }),
      ),
    ]);

    return await this.findOne(id);
  }
}
