import { Injectable } from '@nestjs/common';
import { PurchaseStatus } from 'src/generated/prisma/client';
import {
  PurchaseStatusCreateInput,
  PurchaseStatusUpdateInput,
} from 'src/generated/prisma/models';
import { PrismaService } from 'src/prismaservice/prisma.service';

@Injectable()
export class PurchaseStatusService {
  constructor(private db: PrismaService) {}

  async create(createPurchaseStatusDto: PurchaseStatusCreateInput) {
    return await this.db.purchaseStatus.create({
      data: createPurchaseStatusDto,
    });
  }

  async findAll() {
    return await this.db.purchaseStatus.findMany();
  }

  async findOne(id: string) {
    return await this.db.purchaseStatus.findUnique({ where: { id } });
  }

  async update(id: string, updatePurchaseStatusDto: PurchaseStatusUpdateInput) {
    return await this.db.purchaseStatus.update({
      where: { id },
      data: updatePurchaseStatusDto,
    });
  }

  async remove(id: string) {
    const purchaseStatusToDelete: PurchaseStatus | null =
      await this.db.purchaseStatus.findUnique({
        where: { id },
      });
    if (!purchaseStatusToDelete) {
      throw new Error('PurchaseStatus not found');
    }

    purchaseStatusToDelete.deletedAt = new Date();

    return await this.db.purchaseStatus.update({
      where: { id },
      data: purchaseStatusToDelete,
    });
  }
}
