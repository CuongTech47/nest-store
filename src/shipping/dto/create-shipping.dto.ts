import { IsNotEmpty, IsString } from "class-validator";

export class CreateShippingDto {
  @IsNotEmpty()
  @IsString()
  name : string


}
