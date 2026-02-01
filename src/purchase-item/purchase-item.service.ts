import { Injectable } from '@nestjs/common';
import {
  PurchaseItemCreateInput,
  PurchaseItemUpdateInput,
} from 'src/generated/prisma/models';
import { PrismaService } from 'src/prismaservice/prisma.service';

@Injectable()
export class PurchaseItemService {
  constructor(private db: PrismaService) {}

  async create(createPurchaseItemDto: PurchaseItemCreateInput) {
    return await this.db.purchaseItem.create({ data: createPurchaseItemDto });
  }

  async findAll() {
    return await this.db.purchaseItem.findMany({
      include: { purchase: true, item: true },
    });
  }

  async findOne(id: string) {
    return await this.db.purchaseItem.findUnique({
      where: { id },
      include: { purchase: true, item: true },
    });
  }

  async update(id: string, updatePurchaseItemDto: PurchaseItemUpdateInput) {
    return await this.db.purchaseItem.update({
      where: { id },
      data: updatePurchaseItemDto,
    });
  }

  async remove(id: string) {
    return await this.db.purchaseItem.delete({ where: { id } });
  }
}
