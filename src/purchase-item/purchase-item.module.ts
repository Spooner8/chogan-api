import { Module } from '@nestjs/common';
import { PurchaseItemController } from './purchase-item.controller';
import { PurchaseItemService } from './purchase-item.service';
import { PrismaService } from 'src/prismaservice/prisma.service';

@Module({
  controllers: [PurchaseItemController],
  providers: [PurchaseItemService, PrismaService],
  exports: [PurchaseItemService],
})
export class PurchaseItemModule {}
