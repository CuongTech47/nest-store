import { Injectable, NotFoundException } from "@nestjs/common";
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { PrismaService } from '../prisma.service';
import { DateTime } from 'luxon';

@Injectable()
export class OrdersService {
  constructor(private readonly prisma: PrismaService) {}

  now = DateTime.now().setZone('Asia/Ho_Chi_Minh');
  async create(createOrderDto: CreateOrderDto) {
    return await this.prisma.order.create({
      data: {
        customer: {
          connect: {
            customerId: createOrderDto.customerId,
          },
        },
        subtotal: createOrderDto.subtotal,
        tax: createOrderDto.tax,
        total: createOrderDto.total,
        orderDate: this.now.toJSDate(),
      },
    });
  }

  findAll() {
    return `This action returns all orders`;
  }

  async findOne(id: number) {
    const order = await this.prisma.order.findUnique({
      where : {
        orderId : id
      }
    })

    if (!order){
      throw new NotFoundException(`Order ${id} khong ton tai trong he thong`)
    }
    return await this.prisma.order.findUnique({
      where : {
        orderId : id
      },
      include : {
        customer : true,
        orderItems : true,
        orderPayments : true,
        orderShipping : true,
        _count : true
      }
    })
  }

  update(id: number, updateOrderDto: UpdateOrderDto) {
    return `This action updates a #${id} order`;
  }

  async remove(id: number) {
    const order = await this.prisma.order.findUnique({
      where : {
        orderId : id
      }
    })

    if (!order){
      throw new NotFoundException(`Order ${id} khong ton tai trong he thong`)
    }
    return await this.prisma.order.delete({
      where : {
        orderId : id
      }
    })

  }
}
