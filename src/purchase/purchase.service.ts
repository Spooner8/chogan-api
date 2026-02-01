import { Injectable } from '@nestjs/common';
import {
  PurchaseCreateInput,
  PurchaseUpdateInput,
} from 'src/generated/prisma/models';
import { PrismaService } from 'src/prismaservice/prisma.service';

@Injectable()
export class PurchaseService {
  constructor(private db: PrismaService) {}

  async create(createPurchaseDto: PurchaseCreateInput) {
    return await this.db.purchase.create({ data: createPurchaseDto });
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

  async update(id: string, updatePurchaseDto: PurchaseUpdateInput) {
    return await this.db.purchase.update({
      where: { id },
      data: updatePurchaseDto,
    });
  }

  async remove(id: string) {
    return await this.db.purchase.delete({ where: { id } });
  }
}
