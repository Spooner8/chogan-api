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
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/generated/prisma/enums';
import { UseGuards } from '@nestjs/common';

interface PurchaseItem {
  itemId: string;
  quantity: number;
  price: number;
  discount?: number;
}

interface CreatePurchaseDto {
  deliveryDate?: Date | string;
  purchaseStatusId: string;
  customsDuty?: number;
  shippingCost?: number;
  items?: PurchaseItem[];
}

interface UpdatePurchaseDto {
  deliveryDate?: Date | string;
  purchaseStatusId?: string;
  customsDuty?: number;
  shippingCost?: number;
  items?: PurchaseItem[];
}

@Controller('purchase')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN, Role.USER)
export class PurchaseController {
  constructor(private readonly purchaseService: PurchaseService) {}

  @Post()
  async create(@Body() createPurchaseDto: CreatePurchaseDto) {
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
    @Body() updatePurchaseDto: UpdatePurchaseDto,
  ) {
    return await this.purchaseService.update(id, updatePurchaseDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.purchaseService.remove(id);
  }
}
