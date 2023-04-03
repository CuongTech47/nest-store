import {IsNotEmpty , IsString , IsEmail} from "class-validator";

export class loginAuth {
  @IsNotEmpty()
  @IsEmail()
  email : string

  @IsNotEmpty()
  @IsString()
  password : string


}