import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import {PaginationDto} from "./pagination.dto";

@Injectable()
export class PaginationService {
  constructor(private readonly prisma: PrismaService) {}

  async paginate(
    modelName: string,
    page: number,
    pageSize: number,
  ): Promise<any> {
    const take = pageSize || 10;
    const skip = (page - 1) * take;
    const total = await this.prisma[modelName].count();

    const items = await this.prisma[modelName].findMany({
      take,
      skip,
    });

    const totalPages = Math.ceil(total / take);
    const hasNextPage = page < totalPages;
    const hasPreviousPage = page > 1;
    const nextPage = hasNextPage ? page + 1 : null;
    const previousPage = hasPreviousPage ? page - 1 : null;

    return {

      pageInfo: {
        page,
        pageSize: take,
        total,
        totalPages,
        hasNextPage,
        hasPreviousPage,
        nextPage,
        previousPage,
      },
      items,
    };
  }
}
