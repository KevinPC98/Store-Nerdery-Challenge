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
import { ConfigModule } from '@nestjs/config';
import { ImagesService } from './images/images.service';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'path';
import { ApolloServerPluginLandingPageLocalDefault } from 'apollo-server-core';
import { GqlRolesGuard } from './auth/role/gql-role.guard';
import { GqlJwtGuard } from './auth/strategy/gql-jwt.guard';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
    }),
    AuthModule,
    UserModule,
    ProductModule,
    CartModule,
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema/schema.gql'),
      sortSchema: true,
      playground: false,
      plugins: [ApolloServerPluginLandingPageLocalDefault()],
    }),
  ],
  controllers: [AppController],
  providers: [
    AppService,

    {
      provide: APP_GUARD,
      useClass: GqlJwtGuard,
    },
    {
      provide: APP_GUARD,
      useClass: GqlRolesGuard,
    },
    ImagesService,
  ],
})
export class AppModule {}
