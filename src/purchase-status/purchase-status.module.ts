import { Module } from '@nestjs/common';
import { PurchaseStatusController } from './purchase-status.controller';
import { PurchaseStatusService } from './purchase-status.service';
import { PrismaService } from 'src/prismaservice/prisma.service';

@Module({
  controllers: [PurchaseStatusController],
  providers: [PurchaseStatusService, PrismaService],
  exports: [PurchaseStatusService],
})
export class PurchaseStatusModule {}
