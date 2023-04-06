import { IsNotEmpty, IsNumber } from "class-validator";

export class CreateOrderItemDto {
  @IsNotEmpty()
  @IsNumber()
  orderId : number

  @IsNotEmpty()
  @IsNumber()
  productId : number

  @IsNotEmpty()
  @IsNumber()
  quantity : number

  @IsNotEmpty()
  @IsNumber()
  price : number

  @IsNotEmpty()
  @IsNumber()
  discount : number
}
