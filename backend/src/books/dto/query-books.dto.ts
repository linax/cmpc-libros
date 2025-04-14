import { IsString, IsOptional, IsEnum, IsBoolean, IsNumber } from 'class-validator'
import { Transform, Type } from 'class-transformer'
import { BookGenre } from '../models/book.model'
import { ApiPropertyOptional } from '@nestjs/swagger'

export class QueryBooksDto {
  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ description: 'Filtro por título del libro' })
  title?: string

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ description: 'Filtro por autor del libro',example: 'Schopenhauer'  })
  author?: string

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ description: 'Filtro por editorial', example: 'URANO'  })
  publisher?: string

  @IsOptional()
  @IsEnum(BookGenre)
  @ApiPropertyOptional({ enum: BookGenre, description: 'Filtro por género del libro', example: 'FICTION'  })
  genre?: BookGenre

  @IsOptional()
  @Transform(({ value }) => value === 'true')
  @IsBoolean()
  @ApiPropertyOptional({ description: 'Filtro por disponibilidad',example: true  })
  availability?: boolean

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ default: 'createdAt', description: 'Campo por el cual ordenar' })
  sortBy: string = 'createdAt'


  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  @Type(() => Number)
  @IsNumber()
  @ApiPropertyOptional({ default: 1, description: 'Número de página para paginación' })
  page: number = 1

  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  @Type(() => Number)
  @IsNumber()
  @ApiPropertyOptional({ default: 10, description: 'Número de elementos por página' })
  limit: number = 10

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ description: 'Término de búsqueda (buscará en título, autor y descripción)' })
  search?: string

  @ApiPropertyOptional({ enum: ['asc', 'desc'], default: 'asc' })
  @IsOptional()
  sortDirection?: 'asc' | 'desc' = 'asc'
}