import { Injectable } from '@nestjs/common';
import { Item } from 'src/generated/prisma/client';
import { ItemCreateInput, ItemUpdateInput } from 'src/generated/prisma/models';
import { PrismaService } from 'src/prismaservice/prisma.service';

@Injectable()
export class ItemService {
  constructor(private db: PrismaService) {}

  async create(createItemDto: ItemCreateInput) {
    return await this.db.item.create({ data: createItemDto });
  }

  async findAll() {
    return await this.db.item.findMany({ include: { category: true } });
  }

  async findOne(id: string) {
    return await this.db.item.findUnique({
      where: { id },
      include: { category: true },
    });
  }

  async update(id: string, updateItemDto: ItemUpdateInput) {
    return await this.db.item.update({
      where: { id },
      data: updateItemDto,
    });
  }

  async remove(id: string) {
    const itemToDelete: Item | null = await this.db.item.findUnique({
      where: { id },
    });
    if (!itemToDelete) {
      throw new Error('Item not found');
    }

    itemToDelete.deletedAt = new Date();

    return await this.db.item.update({
      where: { id },
      data: itemToDelete,
    });
  }
}
