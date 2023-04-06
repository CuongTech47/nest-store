import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
  Res,
  Put,
  ParseIntPipe,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { AtGuard } from '../common/guards';
import { Public } from 'src/common/decorators';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import * as express from 'express';
import e, { response } from 'express';
import { UpdateProductCategoriesDto } from './dto/update-product-categories.dto';
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @UseGuards(AtGuard)
  @Post()
  async create(@Body() createProductDto: CreateProductDto) {
    return await this.productsService.create(createProductDto);
    // return this.productsService.create(createProductDto);
  }
  @UseGuards(AtGuard)
  @Post(':id/upload-photo')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, callback) => {
          const name = Date.now() + '_' + Math.random() * 1e9;
          const ext = file.originalname.split('.')[1];
          // const filename = name.split(" ").join("_")+"_" + Date.now() + "." + ext;
          const filename = `photo_${req.params.id}_${name}.${ext}`;

          callback(null, filename);
        },
      }),
      fileFilter: (req, file, callback) => {
        if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
          return callback(null, false);
        }
        callback(null, true);
      },
    }),
  )
  handleUpload(
    @Param('id') productId: number,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file) {
      throw new BadRequestException('File is not image');
    } else {
      const response = {
        filePath: `http://localhost:3000/products/pictures/${file.filename}`,
      };
      return this.productsService.uploadPhoto(productId, file.filename);
    }

    console.log(file);
  }

  @Public()
  @Get('pictures/:filename')
  async getPicture(@Param('filename') filename, @Res() res: express.Response) {
    res.sendFile(filename, { root: './uploads' });
  }

  @Public()
  @Get()
  findAll() {
    return this.productsService.findAll();
  }

  @Public()
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productsService.findOne(+id);
  }
  @UseGuards(AtGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productsService.update(+id, updateProductDto);
  }

  @Put(':id/categories')
  async updateProductCategories(
    @Param('id') id: number,
    @Body() dto: UpdateProductCategoriesDto,
  ) {
    // const productId = parseInt(id, 10);
    // const { categoryIds } = body;

    return this.productsService.updateProductCategories(+id, dto.categoryIds);
  }

  @Delete(':id/categories/:categoryId')
  async deleteProductCategory(
    @Param('id', ParseIntPipe) productId: number,
    @Param('categoryId', ParseIntPipe) categoryId: number[],
  ) {
    return await this.productsService.removeProductCategories(
      productId,
      categoryId,
    );
  }

  @Delete(':id/categories')
  async deleteAllProductCategory(@Param('id') productId: number) {
    return await this.productsService.removeAllProductCategories(+productId);
  }

  @UseGuards(AtGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productsService.remove(+id);
  }
}
