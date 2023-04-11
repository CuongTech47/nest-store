import { Injectable, NotFoundException } from "@nestjs/common";
import { CreateShippingDto } from './dto/create-shipping.dto';
import { UpdateShippingDto } from './dto/update-shipping.dto';
import { PrismaService } from "../prisma.service";

@Injectable()
export class ShippingService {
  constructor(private readonly prisma:PrismaService) {
  }
  async create(createShippingDto: CreateShippingDto) {
    return await this.prisma.shipping.create({
      data : {
        name : createShippingDto.name,
      }
    })
  }

  async findAll() {
    return await this.prisma.shipping.findMany()
  }

 async findOne(id: number) {
    const ship = await this.prisma.shipping.findUnique({
      where : {
        shippingId : id
      }
    })

   if (!ship) {
     throw new NotFoundException(`Không tồn tại id ${id}`)
   }

    return await this.prisma.shipping.findUnique({
      where : {
        shippingId : id
      },
      include : {
        orderShipping : true
      }
    });
  }

  update(id: number, updateShippingDto: UpdateShippingDto) {
    return `This action updates a #${id} shipping`;
  }

  async remove(id: number) {
    const ship = await this.prisma.shipping.findUnique({
      where : {
        shippingId : id
      }
    })

    if (!ship) {
      throw new NotFoundException(`Không tồn tại id ${id}`)
    }
    return await this.prisma.shipping.delete({
      where : {
        shippingId : id
      }
    });
  }
}
