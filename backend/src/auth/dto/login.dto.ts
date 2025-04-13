import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @IsEmail()
  @IsNotEmpty()
  @ApiProperty({ description: 'Email del usuario', example: "test@test.cl" })
  email: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: 'Password del usuario', example: "123456ab*1" })
  password: string;
}
