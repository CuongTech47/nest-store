import {IsNotEmpty , IsString , IsEmail} from "class-validator";

export class createCustomer {
  @IsNotEmpty()
  @IsEmail()
  email : string

  @IsNotEmpty()
  @IsString()
  name :string


  @IsNotEmpty()
  @IsString()
  imgUrl : string


}