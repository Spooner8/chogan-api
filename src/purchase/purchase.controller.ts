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
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/generated/prisma/enums';
import { UseGuards } from '@nestjs/common';

@Controller('purchase')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN, Role.USER)
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
