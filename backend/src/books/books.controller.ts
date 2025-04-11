// src/modules/books/books.controller.ts
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
} from '@nestjs/common';
import { Response } from 'express';
import * as fs from 'fs';
import { BooksService } from './books.service';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { QueryBooksDto } from './dto/query-books.dto';

@Controller('books')
export class BooksController {
  private readonly logger = new Logger(BooksController.name);

  constructor(private readonly booksService: BooksService) {}

  @Post()
  async create(@Body() createBookDto: CreateBookDto) {
    this.logger.log(`Creating new book: ${createBookDto.title}`);
    return this.booksService.create(createBookDto);
  }

  @Get()
  async findAll(@Query() queryDto: QueryBooksDto) {
    this.logger.debug(
      `Finding books with filters: ${JSON.stringify(queryDto)}`,
    );
    return this.booksService.findAll(queryDto);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    this.logger.debug(`Finding book with ID: ${id}`);
    return this.booksService.findOne(id);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateBookDto: UpdateBookDto) {
    this.logger.log(`Updating book with ID: ${id}`);
    return this.booksService.update(id, updateBookDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    this.logger.log(`Soft deleting book with ID: ${id}`);
    await this.booksService.remove(id);
    return { message: 'Book successfully deleted' };
  }

  @Get('export/csv')
  async exportToCsv(@Res() res: Response) {
    this.logger.log('Exporting books to CSV');
    const filePath = await this.booksService.exportToCsv();

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader(
      'Content-Disposition',
      'attachment; filename=books-export.csv',
    );

    const fileStream = fs.createReadStream(filePath);
    fileStream.pipe(res);

    // Delete the file after sending
    fileStream.on('end', () => {
      fs.unlinkSync(filePath);
    });
  }
}
