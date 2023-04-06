import { IsDate, IsNotEmpty, IsNumber } from "class-validator";


export class CreateOrderDto {
  @IsNotEmpty()
  customerId : number

  @IsNotEmpty()
  @IsNumber()
  subtotal : number

  @IsNotEmpty()
  @IsNumber()
  tax : number

  @IsNotEmpty()
  @IsNumber()
  total : number

  // @IsNotEmpty()
  // @IsDate()
  // orderDate: Date

}
