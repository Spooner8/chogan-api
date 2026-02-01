import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { CategoryService } from './category.service';
import type {
  CategoryCreateInput,
  CategoryUpdateInput,
} from 'src/generated/prisma/models';

@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post()
  async create(@Body() createCategoryDto: CategoryCreateInput) {
    return await this.categoryService.create(createCategoryDto);
  }

  @Get()
  async findAll() {
    return await this.categoryService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.categoryService.findOne(id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateCategoryDto: CategoryUpdateInput,
  ) {
    return await this.categoryService.update(id, updateCategoryDto);
  }
}
