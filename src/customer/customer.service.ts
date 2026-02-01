import { Injectable } from '@nestjs/common';
import { Customer } from 'src/generated/prisma/client';
import {
  CustomerCreateInput,
  CustomerUpdateInput,
} from 'src/generated/prisma/models';
import { PrismaService } from 'src/prismaservice/prisma.service';

@Injectable()
export class CustomerService {
  constructor(private db: PrismaService) {}

  async create(createCustomerDto: CustomerCreateInput) {
    return await this.db.customer.create({ data: createCustomerDto });
  }

  async findAll() {
    return await this.db.customer.findMany();
  }

  async findOne(id: string) {
    return await this.db.customer.findUnique({ where: { id } });
  }

  async update(id: string, updateCustomerDto: CustomerUpdateInput) {
    return await this.db.customer.update({
      where: { id },
      data: updateCustomerDto,
    });
  }

  async remove(id: string) {
    const customerToDelete: Customer | null = await this.db.customer.findUnique(
      {
        where: { id },
      },
    );
    if (!customerToDelete) {
      throw new Error('Customer not found');
    }

    customerToDelete.deletedAt = new Date();

    return await this.db.customer.update({
      where: { id },
      data: customerToDelete,
    });
  }
}
