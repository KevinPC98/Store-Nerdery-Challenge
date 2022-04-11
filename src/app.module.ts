import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './users/user.module';
import { ProductModule } from './products/product.module';
import { APP_GUARD } from '@nestjs/core';
import { CartModule } from './carts/cart.module';
import { ConfigModule } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'path';
import { ApolloServerPluginLandingPageLocalDefault } from 'apollo-server-core';
import { GqlRolesGuard } from './auth/guards/gql-role.guard';
import { GqlJwtGuard } from './auth/guards/gql-jwt.guard';
import { ImagesService } from './images/images.service';
import { EmailsService } from './emails/emails.service';

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
    EmailsService,
  ],
})
export class AppModule {}
