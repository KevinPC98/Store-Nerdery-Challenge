import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { ProductModule } from './product/product.module';
import { APP_GUARD } from '@nestjs/core';
import { RolesGuard } from './auth/role/role.guard';
import { JwtAuthGuard } from './auth/strategy/jwt.guard';
import { CartModule } from './cart/cart.module';

@Module({
  imports: [AuthModule, UserModule, ProductModule, CartModule],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AppModule {}
