import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { PrismaService } from "../prisma.service";

@Injectable()
export class CustomersService {

  constructor(readonly prisma : PrismaService) {
  }
  create(createCustomerDto: CreateCustomerDto) {
    return 'This action adds a new customer';
  }

  async findAll() {
    return await this.prisma.customer.findMany()
  }

  async findOne(id: number) {
    const customer = await this.prisma.customer.findUnique({
      where : {
        customerId : id
      }
    })
    if (!customer){
      throw new NotFoundException(`Customer with id ${id} not found`);
    }

    return await this.prisma.customer.findMany({
      where : {
        customerId : id
      },
      include: {
        Order: true,
      },
    })
  }

  update(id: number, updateCustomerDto: UpdateCustomerDto) {
    return `This action updates a #${id} customer`;
  }

  async remove(id: number) {
    const customer = await this.prisma.customer.findUnique({
      where : {
        customerId : id
      }
    })
    if (!customer){
      throw new NotFoundException(`Customer with id ${id} not found`);
    }

    return await this.prisma.customer.delete({
      where :{
        customerId :id
      }
    })
  }
}
