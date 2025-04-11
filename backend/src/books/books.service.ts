import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { Book } from './models/book.model';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { QueryBooksDto } from './dto/query-books.dto';
import { createObjectCsvWriter } from 'csv-writer'; // Data export in csv format
import * as fs from 'fs';
import * as path from 'path';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class BooksService {
  constructor(
    @InjectModel(Book)
    private bookModel: typeof Book,
  ) {}

  async create(createBookDto: CreateBookDto): Promise<Book> {
    return this.bookModel.create({ ...createBookDto });
  }

  async findAll(
    queryDto: QueryBooksDto,
  ): Promise<{ data: Book[]; total: number; page: number; limit: number }> {
    const {
      title,
      author,
      publisher,
      genre,
      availability,
      sortBy,
      order,
      page,
      limit,
    } = queryDto;

    const whereClause: any = {};

    if (title) {
      whereClause.title = { [Op.iLike]: `%${title}%` };
    }

    if (author) {
      whereClause.author = { [Op.iLike]: `%${author}%` };
    }

    if (publisher) {
      whereClause.publisher = { [Op.iLike]: `%${publisher}%` };
    }

    if (genre) {
      whereClause.genre = genre;
    }

    if (availability !== undefined) {
      whereClause.availability = availability;
    }

    const { rows, count } = await this.bookModel.findAndCountAll({
      where: whereClause,
      order: [[sortBy || 'createdAt', order || 'DESC']],
      limit,
      offset: (page - 1) * limit,
    });

    return {
      data: rows,
      total: count,
      page,
      limit,
    };
  }

  async findOne(id: string): Promise<Book> {
    const book = await this.bookModel.findByPk(id);

    if (!book) {
      throw new NotFoundException(`Book with ID ${id} not found`);
    }

    return book;
  }

  async update(id: string, updateBookDto: UpdateBookDto): Promise<Book> {
    const book = await this.findOne(id);
    await book.update(updateBookDto);
    return book;
  }

  async remove(id: string): Promise<void> {
    const book = await this.findOne(id);
    await book.destroy();
  }

  async exportToCsv(): Promise<string> {
    const books = await this.bookModel.findAll();

    // Just in case temp directory  doesn't exist
    const tempDir = path.join(process.cwd(), 'temp');
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir);
    }

    const filename = `books-export-${uuidv4()}.csv`;
    const filepath = path.join(tempDir, filename);

    const csvWriter = createObjectCsvWriter({
      path: filepath,
      header: [
        { id: 'id', title: 'ID' },
        { id: 'title', title: 'Title' },
        { id: 'author', title: 'Author' },
        { id: 'publisher', title: 'Publisher' },
        { id: 'price', title: 'Price' },
        { id: 'availability', title: 'Availability' },
        { id: 'genre', title: 'Genre' },
        { id: 'stock', title: 'Stock' },
        { id: 'isbn', title: 'ISBN' },
        { id: 'createdAt', title: 'Created At' },
        { id: 'updatedAt', title: 'Updated At' },
      ],
    });

    await csvWriter.writeRecords(books.map((book) => book.toJSON()));

    return filepath;
  }
}
