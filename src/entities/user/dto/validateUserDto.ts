import { IsEmail, IsString, MinLength } from 'class-validator';

export class ValidateUserDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(1)
  userName: string;

  @IsString()
  @MinLength(1)
  userSurname: string;

  @IsString()
  @MinLength(6)
  password: string;
}
