import { IsNotEmpty, IsNumber, IsPositive, IsString } from "class-validator";

export class CreateProductDto {
  @IsNotEmpty()
  @IsString()
  name : string

  @IsNotEmpty()
  @IsString()
  description : string

  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  price : number



  categoryId? : number[]



}
