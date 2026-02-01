import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ItemService } from './item.service';
import type {
  ItemCreateInput,
  ItemUpdateInput,
} from 'src/generated/prisma/models';

@Controller('item')
export class ItemController {
  constructor(private readonly itemService: ItemService) {}

  @Post()
  async create(@Body() createItemDto: ItemCreateInput) {
    return await this.itemService.create(createItemDto);
  }

  @Get()
  async findAll() {
    return await this.itemService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.itemService.findOne(id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateItemDto: ItemUpdateInput,
  ) {
    return await this.itemService.update(id, updateItemDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.itemService.remove(id);
  }
}
