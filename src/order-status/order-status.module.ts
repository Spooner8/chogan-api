import { Module } from '@nestjs/common';
import { OrderStatusController } from './order-status.controller';
import { OrderStatusService } from './order-status.service';
import { PrismaService } from 'src/prismaservice/prisma.service';

@Module({
  controllers: [OrderStatusController],
  providers: [OrderStatusService, PrismaService],
  exports: [OrderStatusService],
})
export class OrderStatusModule {}
