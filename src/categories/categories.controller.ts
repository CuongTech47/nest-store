import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ParseIntPipe, UsePipes, ValidationPipe, UseGuards
} from "@nestjs/common";
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { AtGuard } from "../common/guards";
import { Public } from "src/common/decorators";
import { GetFilterCategoryDto} from "./dto/get-filter-category.dto";

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}


  @UseGuards(AtGuard)
  @Post()
  create(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoriesService.create(createCategoryDto);
  }


  @Public()
  @Get()
  @UsePipes(new ValidationPipe({ transform: true }))
  async findAll(
    @Query('page') page: string = '1',
    @Query('pageSize') pageSize: string = '10',
    @Query()  getFilterCategoryDto : GetFilterCategoryDto
  ) {
    if (Object.keys(getFilterCategoryDto).length) {
      return await this.categoriesService.findAllWithFilter(getFilterCategoryDto)
    }
    return await this.categoriesService.findAll(parseInt(page), parseInt(pageSize));
  }


  // @Public()
  // @Get('test')
  // async finSearch(@Query() getFilterCategoryDto:GetFilterCategoryDto){
  //   if (Object.keys(getFilterCategoryDto).length){
  //     return await this.categoriesService.findAllWithFilter(getFilterCategoryDto)
  //   }
  //
  // }

  @Public()
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.categoriesService.findOne(+id);
  }
  @UseGuards(AtGuard)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    return this.categoriesService.update(+id, updateCategoryDto);
  }
  @UseGuards(AtGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.categoriesService.remove(+id);
  }
}
