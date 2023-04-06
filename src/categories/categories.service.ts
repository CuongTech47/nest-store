import { Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { PrismaService } from '../prisma.service';
import { PaginationService } from '../pagination/paginator';
import { GetFilterCategoryDto } from './dto/get-filter-category.dto';

@Injectable()
export class CategoriesService {
  constructor(
    private readonly paginationService: PaginationService,
    private readonly prisma: PrismaService,
  ) {}
  async create(createCategoryDto: CreateCategoryDto) {
    return await this.prisma.category.create({ data: createCategoryDto });
  }

  async findAll(page: number, pageSize: number) {
    return await this.paginationService.paginate('category', page, pageSize);
  }
  async findAllWithFilter(getFilterCategoryDto: GetFilterCategoryDto) {
    // let category = this.findAll(1, 10);

    const { search } = getFilterCategoryDto;
    let allCategories = await this.prisma.category.findMany();
    console.log(allCategories);
    if (search) {
      allCategories = allCategories.filter((category) =>
        category.name.includes(search),
      );
    }

    return allCategories;
  }

  async findOne(id: number) {
    return await this.prisma.category.findUnique({
      where: { categoryId: id },
      include: {
        products: true,
      },
    });
  }

  async update(id: number, updateCategoryDto: UpdateCategoryDto) {
    return await this.prisma.category.update({
      data: updateCategoryDto,
      where: {
        categoryId: id,
      },
    });
  }
  async remove(id: number) {
    return await this.prisma.category.delete({
      where: {
        categoryId: id,
      },
    });
  }
}
