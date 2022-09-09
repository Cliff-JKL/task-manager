import { IsString, IsEmail, Matches, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsString()
  username: string;

  @ApiProperty()
  @IsString()
  @MinLength(10, { message: 'The password must be at least 10 characters' })
  @Matches(/\d+/, {
    message: 'The password must contains at least one number character',
  })
  @Matches(/[A-Za-z]+/, {
    message: 'The password must contains at least one letter character',
  })
  password: string;
}
