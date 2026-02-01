import { Injectable } from '@nestjs/common';
import { Category } from 'src/generated/prisma/client';
import {
  CategoryCreateInput,
  CategoryUpdateInput,
} from 'src/generated/prisma/models';
import { PrismaService } from 'src/prismaservice/prisma.service';

@Injectable()
export class CategoryService {
  constructor(private db: PrismaService) {}

  async create(createCategoryDto: CategoryCreateInput) {
    return await this.db.category.create({ data: createCategoryDto });
  }

  async findAll() {
    return await this.db.category.findMany();
  }

  async findOne(id: string) {
    return await this.db.category.findUnique({ where: { id } });
  }

  async update(id: string, updateCategoryDto: CategoryUpdateInput) {
    return await this.db.category.update({
      where: { id },
      data: updateCategoryDto,
    });
  }

  async remove(id: string) {
    const categoryToDelete: Category | null = await this.db.category.findUnique(
      {
        where: { id },
      },
    );
    if (!categoryToDelete) {
      throw new Error('Category not found');
    }

    categoryToDelete.deletedAt = new Date();

    return await this.db.category.update({
      where: { id },
      data: categoryToDelete,
    });
  }
}
