import { IsEmail, IsString, MinLength } from 'class-validator';

export class UpdateUserDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(1)
  userName: string;

  @IsString()
  @MinLength(1)
  userSurname: string;
}
