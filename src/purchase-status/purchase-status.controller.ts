import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { PurchaseStatusService } from './purchase-status.service';
import type {
  PurchaseStatusCreateInput,
  PurchaseStatusUpdateInput,
} from 'src/generated/prisma/models';

@Controller('purchase-status')
export class PurchaseStatusController {
  constructor(private readonly purchaseStatusService: PurchaseStatusService) {}

  @Post()
  async create(@Body() createPurchaseStatusDto: PurchaseStatusCreateInput) {
    return await this.purchaseStatusService.create(createPurchaseStatusDto);
  }

  @Get()
  async findAll() {
    return await this.purchaseStatusService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.purchaseStatusService.findOne(id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updatePurchaseStatusDto: PurchaseStatusUpdateInput,
  ) {
    return await this.purchaseStatusService.update(id, updatePurchaseStatusDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.purchaseStatusService.remove(id);
  }
}
