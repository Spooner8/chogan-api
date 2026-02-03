import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import type { ExecutionContext } from '@nestjs/common';
import { Request } from 'express';
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
import { DatabaseSetupService } from './database-setup/database-setup.service';

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

    ThrottlerModule.forRoot([
      {
        name: 'short',
        ttl: 1000,
        limit: 5,
        skipIf: (context: ExecutionContext) => {
          const req = context.switchToHttp().getRequest<Request>();
          return req.method === 'OPTIONS';
        },
      },
      {
        name: 'long',
        ttl: 60000,
        limit: 100,
        skipIf: (context: ExecutionContext) => {
          const req = context.switchToHttp().getRequest<Request>();
          return req.method === 'OPTIONS';
        },
      },
    ]),
  ],
  controllers: [],
  providers: [
    PrismaService,
    DatabaseSetupService,

    { provide: APP_GUARD, useClass: ThrottlerGuard },
  ],
})
export class AppModule {}
