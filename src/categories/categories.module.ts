import { Module } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CategoriesController } from './categories.controller';
import { PrismaService } from "../prisma.service";
import { PaginationService } from "../pagination/paginator";

@Module({
  controllers: [CategoriesController],
  providers: [CategoriesService , PrismaService , PaginationService]
})
export class CategoriesModule {}
