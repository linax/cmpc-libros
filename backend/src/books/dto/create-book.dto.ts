import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsEnum,
  IsOptional,
  IsBoolean,
  Min,
  IsISBN,
} from 'class-validator';
import { BookGenre } from '../models/book.model';
import { ApiProperty } from '@nestjs/swagger';

export class CreateBookDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: 'Título del libro', example: 'El Gran Libro' })
  title: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: 'Autor del libro', example: 'John Doe' })
  author: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: 'Editorial del libro', example: 'Editorial XYZ' })
  publisher: string;

  @IsNumber()
  @Min(0)
  @ApiProperty({ description: 'Precio del libro', example: 19.99 })
  price: number;

  @IsBoolean()
  @IsOptional()
  @ApiProperty({ description: 'Disponibilidad del libro', example: true })
  availability: boolean = true;

  @IsEnum(BookGenre)
  @ApiProperty({ description: 'Género del libro', example: 'FICTION' })
  genre: BookGenre;

  @IsNumber()
  @Min(0)
  @ApiProperty({ description: 'Stock del libro', example: '3' })
  stock: number;

  @IsString()
  @IsOptional()
  @ApiProperty({
    description: 'Descripción del libro',
    example:
      'Libro que cuenta las aventuras de charly en la fábrica de chocolates',
  })
  description?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ description: 'ISBN del libro', example: '123123' })
  isbn?: string;
}
