import { Module } from '@nestjs/common';
import { PurchaseController } from './purchase.controller';
import { PurchaseService } from './purchase.service';
import { PrismaService } from 'src/prismaservice/prisma.service';

@Module({
  controllers: [PurchaseController],
  providers: [PurchaseService, PrismaService],
  exports: [PurchaseService],
})
export class PurchaseModule {}
