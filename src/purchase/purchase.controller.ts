import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { PurchaseService } from './purchase.service';
import type {
  PurchaseCreateInput,
  PurchaseUpdateInput,
} from 'src/generated/prisma/models';

@Controller('purchase')
export class PurchaseController {
  constructor(private readonly purchaseService: PurchaseService) {}

  @Post()
  async create(@Body() createPurchaseDto: PurchaseCreateInput) {
    return await this.purchaseService.create(createPurchaseDto);
  }

  @Get()
  async findAll() {
    return await this.purchaseService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.purchaseService.findOne(id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updatePurchaseDto: PurchaseUpdateInput,
  ) {
    return await this.purchaseService.update(id, updatePurchaseDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.purchaseService.remove(id);
  }
}
