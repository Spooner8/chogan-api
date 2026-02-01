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
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/generated/prisma/enums';
import { UseGuards } from '@nestjs/common';

@Controller('purchase-status')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN, Role.USER)
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
