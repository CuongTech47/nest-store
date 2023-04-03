import { IsNotEmpty, IsString, IsEmail, Length, IsUppercase, Matches } from "class-validator";

export class AuthDto {
  @IsNotEmpty()
  @IsString()
  username: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @Length(7)
  @Matches(/[\W]/, { message: 'Password must contain at least one special character' })
  password: string;

}

