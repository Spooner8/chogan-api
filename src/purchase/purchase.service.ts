import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prismaservice/prisma.service';

interface PurchaseItem {
  itemId: string;
  quantity: number;
  price: number;
  discount?: number;
}

interface CreatePurchaseDto {
  deliveryDate?: Date | string;
  purchaseStatusId: string;
  customsDuty?: number;
  shippingCost?: number;
  items?: PurchaseItem[];
}

interface UpdatePurchaseDto {
  deliveryDate?: Date | string;
  purchaseStatusId?: string;
  customsDuty?: number;
  shippingCost?: number;
  items?: PurchaseItem[];
}

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
    const { items, ...purchaseData } = updatePurchaseDto;

    return await this.db.purchase.update({
      where: { id },
      data: {
        ...purchaseData,
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
}
