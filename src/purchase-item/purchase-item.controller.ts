import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { PurchaseItemService } from './purchase-item.service';
import type {
  PurchaseItemCreateInput,
  PurchaseItemUpdateInput,
} from 'src/generated/prisma/models';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/generated/prisma/enums';
import { UseGuards } from '@nestjs/common';

@Controller('purchase-item')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN, Role.USER)
export class PurchaseItemController {
  constructor(private readonly purchaseItemService: PurchaseItemService) {}

  @Post()
  async create(@Body() createPurchaseItemDto: PurchaseItemCreateInput) {
    return await this.purchaseItemService.create(createPurchaseItemDto);
  }

  @Get()
  async findAll() {
    return await this.purchaseItemService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.purchaseItemService.findOne(id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updatePurchaseItemDto: PurchaseItemUpdateInput,
  ) {
    return await this.purchaseItemService.update(id, updatePurchaseItemDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.purchaseItemService.remove(id);
  }
}
