import { Injectable, NotFoundException } from "@nestjs/common";
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { PrismaService } from "../prisma.service";

@Injectable()
export class PaymentsService {
  constructor(readonly prisma : PrismaService) {
  }
  async create(createPaymentDto: CreatePaymentDto) {
    return await this.prisma.payment.create({
      data : {
        name : createPaymentDto.name
      }
    });
  }

  async findAll() {
    return await this.prisma.payment.findMany()
  }

  async findOne(id: number) {
    const payment = await this.prisma.payment.findUnique({
      where :{
        paymentId : id
      }
    })
    if (!payment){
      throw new NotFoundException(`Không tôn tại payment ID ${id}`)
    }
    return await this.prisma.payment.findUnique({
        where : {
          paymentId : id
        }
      });
  }

  update(id: number, updatePaymentDto: UpdatePaymentDto) {
    return `This action updates a #${id} payment`;
  }

  async remove(id: number) {
    const payment = await this.prisma.payment.findUnique({
      where :{
        paymentId : id
      }
    })
    if (!payment){
      throw new NotFoundException(`Không tôn tại payment ID ${id}`)
    }
    return await this.prisma.payment.delete({
      where : {
        paymentId : id
      }
    })
  }
}
