import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class AuthDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsString()
  lastName: string

  @IsString()
  firstName: string
}


export class LoginDTO {
    @IsEmail()
    @IsNotEmpty()
    email: string;
  
    @IsString()
    @IsNotEmpty()
    password: string;
}