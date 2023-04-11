import { IsEmail, IsNotEmpty, IsString } from "class-validator";
export class CreateCategoryDto {
  @IsNotEmpty()
  @IsString()
  name : string;

  productId? : number[]
}
