import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { CustomerService } from './customer.service';
import type {
  CustomerCreateInput,
  CustomerUpdateInput,
} from 'src/generated/prisma/models';

@Controller('customer')
export class CustomerController {
  constructor(private readonly customerService: CustomerService) {}

  @Post()
  async create(@Body() createCustomerDto: CustomerCreateInput) {
    return await this.customerService.create(createCustomerDto);
  }

  @Get()
  async findAll() {
    return await this.customerService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.customerService.findOne(id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateCustomerDto: CustomerUpdateInput,
  ) {
    return await this.customerService.update(id, updateCustomerDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.customerService.remove(id);
  }
}
