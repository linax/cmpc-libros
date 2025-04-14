import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  Res,
  Logger,
} from '@nestjs/common'
import { Response } from 'express'
import * as fs from 'fs'
import { BooksService } from './books.service'
import { CreateBookDto } from './dto/create-book.dto'
import { UpdateBookDto } from './dto/update-book.dto'
import { QueryBooksDto } from './dto/query-books.dto'
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger'
import { Book } from './models/book.model'

@ApiTags('books')
@Controller('books')
export class BooksController {
  private readonly logger = new Logger(BooksController.name)

  constructor(private readonly booksService: BooksService) {}

  @Post()
  @ApiOperation({ summary: 'Crear un nuevo libro' })
  @ApiResponse({
    status: 201,
    description: 'Libro creado exitosamente.',
    type: Book,
  })
  @ApiResponse({ status: 400, description: 'Petición incorrecta.' })
  async create(@Body() createBookDto: CreateBookDto) {
    this.logger.log(`Creating new book: ${createBookDto.title}`)
    return this.booksService.create(createBookDto)
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todos los libros' })
  @ApiResponse({
    status: 200,
    description: 'Lista de libros con paginación',
    schema: {
      properties: {
        data: {
          type: 'array',
          items: { $ref: '#/components/schemas/Book' },
        },
        pagination: {
          type: 'object',
          properties: {
            total: { type: 'number' },
            page: { type: 'number' },
            limit: { type: 'number' },
            totalPages: { type: 'number' },
            hasNextPage: { type: 'boolean' },
            hasPreviousPage: { type: 'boolean' },
          },
        },
      },
    },
  })
  async findAll(@Query() queryDto: QueryBooksDto) {
    this.logger.debug(`Finding books with filters: ${JSON.stringify(queryDto)}`)
    return this.booksService.findAll(queryDto)
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un libro por ID' })
  @ApiResponse({ status: 200, description: 'Libro encontrado', type: Book })
  @ApiResponse({ status: 404, description: 'Libro no encontrado.' })
  async findOne(@Param('id') id: string) {
    this.logger.debug(`Finding book with ID: ${id}`)
    return this.booksService.findOne(id)
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar un libro por ID' })
  @ApiResponse({ status: 200, description: 'Libro actualizado exitosamente.' })
  @ApiResponse({ status: 404, description: 'Libro no pudo ser actualizado.' })
  async update(@Param('id') id: string, @Body() updateBookDto: UpdateBookDto) {
    this.logger.log(`Updating book with ID: ${id}`)
    return this.booksService.update(id, updateBookDto)
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar un libro por ID' })
  @ApiResponse({ status: 200, description: 'Libro eliminado exitosamente.' })
  @ApiResponse({ status: 404, description: 'Libro no encontrado.' })
  async remove(@Param('id') id: string) {
    this.logger.log(`Soft deleting book with ID: ${id}`)
    await this.booksService.remove(id)
    return { message: 'Book successfully deleted' }
  }

  @Get('export/csv')
  @ApiOperation({ summary: 'Exportar libros de un csv' })
  @ApiResponse({ status: 200, description: 'Libro exportado exitosamente.' })
  @ApiResponse({ status: 404, description: 'Libro no pudo ser exportado.' })
  async exportToCsv(@Res() res: Response) {
    this.logger.log('Exporting books to CSV')
    const filePath = await this.booksService.exportToCsv()

    res.setHeader('Content-Type', 'text/csv')
    res.setHeader(
      'Content-Disposition',
      'attachment; filename=books-export.csv',
    )

    const fileStream = fs.createReadStream(filePath)
    fileStream.pipe(res)

    // Delete the file after sending
    fileStream.on('end', () => {
      fs.unlinkSync(filePath)
    })
  }
}
