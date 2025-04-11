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

export class CreateBookDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  author: string;

  @IsString()
  @IsNotEmpty()
  publisher: string;

  @IsNumber()
  @Min(0)
  price: number;

  @IsBoolean()
  @IsOptional()
  availability: boolean = true;

  @IsEnum(BookGenre)
  genre: BookGenre;

  @IsNumber()
  @Min(0)
  stock: number;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsISBN()
  @IsOptional()
  isbn?: string;
}
