import {
  IsEmail,
  IsNotEmpty,
  IsString,
  IsEnum,
  MinLength,
} from 'class-validator'
import { UserRole } from '../../users/models/user.model'
import { ApiProperty } from '@nestjs/swagger'

export class RegisterDto {
  @IsEmail()
  @IsNotEmpty()
  @ApiProperty({ description: 'Email del usuario', example: 'test@test.cl' })
  email: string

  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  @ApiProperty({ description: 'Password del usuario', example: '123456ab*1' })
  password: string

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: 'Nombre del usuario', example: 'Juanita perez' })
  fullName: string

  @IsEnum(UserRole)
  role: UserRole = UserRole.CLIENT
}
