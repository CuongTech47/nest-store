import { Injectable, NotFoundException } from "@nestjs/common";
import { CreateOrderItemDto } from './dto/create-order-item.dto';
import { UpdateOrderItemDto } from './dto/update-order-item.dto';
import { PrismaService } from "../prisma.service";

@Injectable()
export class OrderItemsService {

  constructor(private readonly prisma : PrismaService) {
  }
  async create(createOrderItemDto: CreateOrderItemDto) {
    return await this.prisma.orderItem.create({
      data : {
        orderId : createOrderItemDto.orderId,
        productId : createOrderItemDto.productId,
        quantity : createOrderItemDto.quantity,
        price : createOrderItemDto.price,
        discount : createOrderItemDto.discount
      }
    })
  }

  async findAll() {
    return await this.prisma.orderItem.findMany()
  }

  async findOne(id: number) {
    const orderItem = await this.prisma.orderItem.findUnique({
      where : {
        orderItemId : id
      }
    })
    if (!orderItem) {
      throw new NotFoundException(`Khong ton tai orderItem ${id}`)
    }
    return await this.prisma.orderItem.findUnique({
      where : {
        orderItemId : id
      },
      include : {
        order : true,
        product : true
      }
    })
  }

  update(id: number, updateOrderItemDto: UpdateOrderItemDto) {
    return `This action updates a #${id} orderItem`;
  }

  async remove(id: number) {
    const orderItem = await this.prisma.orderItem.findUnique({
      where : {
        orderItemId : id
      }
    })
    if (!orderItem) {
      throw new NotFoundException(`Khong ton tai orderItem ${id}`)
    }

    return await this.prisma.orderItem.delete({
      where : {
        orderItemId : id
      }
    })
  }
}
