import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CategoriesModule } from './categories/categories.module';
import { ProductsModule } from './products/products.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { APP_GUARD } from "@nestjs/core";
import { AtGuard } from "./common/guards";
import { ConfigModule } from "@nestjs/config";
import { MulterModule } from "@nestjs/platform-express";


@Module({
  imports: [ConfigModule.forRoot({isGlobal : true}),CategoriesModule, ProductsModule, UsersModule, AuthModule,MulterModule.register({
    dest : './uploads'
  }) ],
  controllers: [AppController],
  providers: [AppService,{
    provide : APP_GUARD,
    useClass : AtGuard
  }]
})
export class AppModule {}
