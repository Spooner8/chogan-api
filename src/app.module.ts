import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaService } from './prismaservice/prisma.service';
import { UserModule } from './user/user.module';
import { CategoryModule } from './category/category.module';
import { ItemModule } from './item/item.module';
import { CustomerModule } from './customer/customer.module';
import { OrderStatusModule } from './order-status/order-status.module';
import { OrderModule } from './order/order.module';
import { OrderItemModule } from './order-item/order-item.module';
import { PurchaseStatusModule } from './purchase-status/purchase-status.module';
import { PurchaseModule } from './purchase/purchase.module';
import { PurchaseItemModule } from './purchase-item/purchase-item.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    AuthModule,
    UserModule,
    CategoryModule,
    ItemModule,
    CustomerModule,
    OrderStatusModule,
    OrderModule,
    OrderItemModule,
    PurchaseStatusModule,
    PurchaseModule,
    PurchaseItemModule,
  ],
  controllers: [],
  providers: [PrismaService],
})
export class AppModule {}
