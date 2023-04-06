import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from "@nestjs/common";
import { CustomersService } from './customers.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { AuthGuard } from "@nestjs/passport";
import { Public } from "src/common/decorators";

@Controller('customers')
export class CustomersController {
  constructor(private readonly customersService: CustomersService) {}


  // @Get('google')
  // @UseGuards(AuthGuard('google'))
  // async googleLogin(){
  //
  // }
  // @Get('google')
  // @UseGuards(AuthGuard('google'))
  // async googleLogin(){
  //
  // }


  @Post()
  create(@Body() createCustomerDto: CreateCustomerDto) {
    return this.customersService.create(createCustomerDto);
  }

  @Public()
  @Get()
  findAll() {
    return this.customersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.customersService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCustomerDto: UpdateCustomerDto) {
    return this.customersService.update(+id, updateCustomerDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.customersService.remove(+id);
  }


}
