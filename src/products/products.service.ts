import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UploadedFile,
} from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PrismaService } from '../prisma.service';
import { PaginationService } from '../pagination/paginator';
import * as path from 'path';
import { v4 as uuidv4 } from 'uuid';
import * as fs from 'fs-extra';

import { CreatePhotoDto } from './dto/upload-product.dto';
import { extname } from 'path';
import multer, { diskStorage, DiskStorageOptions } from 'multer';
import { doc } from 'prettier';
import join = doc.builders.join;
@Injectable()
export class ProductsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly paginationService: PaginationService,
  ) {}
  async create(createProductDto: CreateProductDto) {
    const { name, description, price, categoryId } = createProductDto;

    const newProduct = await this.prisma.product.create({
      data: {
        name,
        description,
        price,
        categories: {
          create: categoryId.map((categoryId) => ({ categoryId })),
        },
      },
      include: {
        categories: true,
      },
    });
    return newProduct;
  }

  async findAll() {
    return await this.prisma.product.findMany();
  }

  async findOne(id: number) {
    return await this.prisma.product.findUnique({
      where: {
        productId: id,
      },
      include: {
        categories: true,
      },
    });
  }

  async update(id: number, updateProductDto: UpdateProductDto) {
    // const { name, description, price, imageUrl,categoryId } = updateProductDto;
    //
    // const product = await this.findOne(id);
    // if (!product) {
    //   throw new NotFoundException(`Product with id ${id} not found`)
    // }
    //
    // const categoryIds = categoryId.map(id => ({ id }));
    //
    //
    // const updatedProduct = await this.prisma.product.update({
    //
    //   where: { productId: id },
    //   data: {
    //     name,
    //     description,
    //     price,
    //     imageUrl,
    //     categories: {
    //       set:categoryIds,
    //     },
    //   },
    // });
    //
    // return updatedProduct;
  }

  async remove(id: number) {
    const product = await this.prisma.product.findUnique({
      where: {
        productId: id,
      },
    });

    if (!product) {
      throw new NotFoundException(`Product with id ${id} not found`);
    }

    // Xóa tất cả các bản ghi trong bảng ProductCategory liên quan đến sản phẩm này

    const deletedProduct = await this.prisma.product.delete({
      where: { productId: id },
      include : {
        categories : true,
        OrderItem : true
      }
    });
    return deletedProduct;
  }

  async uploadPhoto(productId: number, file: string) {
    const product = await this.prisma.product.findUnique({
      where: {
        productId: Number(productId),
      },
    });
    if (!product) {
      throw new NotFoundException(`Product with id ${productId} not found`);
    }

    return await this.prisma.product.update({
      where: {
        productId: Number(productId),
      },
      data: {
        imageUrl: file,
      },
    });
  }
  async getPicture() {}


  // async updateProductCategories(productId: number, categoryIds: number[]) {
  //   const product = await this.prisma.product.findUnique({
  //     where: { productId: productId },
  //     include: { categories: true },
  //   });
  //
  //
  //   if (!product) {
  //     throw new NotFoundException(`Product with ID ${productId} not found`);
  //   }
  //
  //   const existingCategoryIds = product.categories.map((category) => category.categoryId);
  //   const newCategoryIds = categoryIds.filter((categoryId) => !existingCategoryIds.includes(categoryId));
  //
  //   const newProductCategories = newCategoryIds.map((categoryId) => {
  //     return {
  //       productId: productId,
  //       categoryId: categoryId,
  //     };
  //   });
  //
  //   const createdProductCategories = await this.prisma.productCategory.createMany({
  //     data: newProductCategories,
  //   });
  //
  //   const updatedProduct = await this.prisma.product.update({
  //     where: { productId: productId },
  //     data: {
  //       categories: {
  //         set: [
  //           ...product.categories.map((category) => ({
  //             productId: productId,
  //             categoryId: category.categoryId,
  //           })),
  //           ...newCategoryIds.map((categoryId) => ({
  //             productId: productId,
  //             categoryId: categoryId,
  //           })),
  //         ] as any,
  //       },
  //     },
  //   });
  //
  //   return updatedProduct;
  // }

  async updateProductCategories(productId: number, categoryIds: number[]) {
    const product = await this.prisma.product.findUnique({
      where: { productId: productId },
      include: { categories: true },
    });

    if (!product) {
      throw new NotFoundException(`Product with ID ${productId} not found`);
    }

    const existingCategoryIds = product.categories.map((category) => category.categoryId);
    const newCategoryIds = categoryIds.filter((categoryId) => !existingCategoryIds.includes(categoryId));

    const newProductCategories = newCategoryIds.map((categoryId) => {
      return {
        productId: productId,
        categoryId: categoryId,
      };
    });

    const createdProductCategories = await this.prisma.productCategory.createMany({
      data: newProductCategories,
    });

    const updatedProduct = await this.prisma.product.update({
      where: { productId: productId },
      data: {
        categories: {
          set: [
            ...product.categories.map((category) => ({
              productId_categoryId: {
                productId: category.productId,
                categoryId: category.categoryId,
              },
            })),
            ...newCategoryIds.map((categoryId) => ({
              productId_categoryId: {
                productId: productId,
                categoryId: categoryId,
              },
            })),
          ],
        },
      },
    });

    return updatedProduct;
  }

  async removeProductCategories(productId: number, categoryIds: number[]) {
    const deletedProductCategories = await this.prisma.productCategory.deleteMany({
      where: {
        productId: productId,
        categoryId: { in: categoryIds },
      },
    });

    return deletedProductCategories;
  }
  async removeAllProductCategories(productId: number) {
    const updatedProduct = await this.prisma.product.update({
      where: {
        productId,
      },
      data: {
        categories: {
          deleteMany: {},
        },
      },
      include: {
        categories: true,
      },
    });
    return updatedProduct;
  }

}
