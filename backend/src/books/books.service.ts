import { Injectable, NotFoundException, Logger } from '@nestjs/common';
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
  private readonly logger = new Logger(BooksService.name);

  constructor(
    @InjectModel(Book)
    private bookModel: typeof Book,
  ) {}

  async create(createBookDto: CreateBookDto): Promise<Book> {
    return this.bookModel.create({ ...createBookDto });
  }

  async findAll(queryDto: QueryBooksDto) {
    const { 
      page = 1, 
      limit = 10, 
      sortBy = 'createdAt', 
      sortDirection = 'DESC',
      search,
      title,
      author,
      publisher,
      genre,
      availability
    } = queryDto;

    // Construir las condiciones de búsqueda
    const whereConditions = {};
    
    // Agregar filtros específicos solo si están definidos
    if (title) whereConditions['title'] = { [Op.like]: `%${title}%` };
    if (author) whereConditions['author'] = { [Op.like]: `%${author}%` };
    if (publisher) whereConditions['publisher'] = { [Op.like]: `%${publisher}%` };
    if (genre) whereConditions['genre'] = genre;

    if (availability !== undefined) whereConditions['availability'] = !availability; // Invertimos el valor

    // Agregar searchTerm para búsqueda general si está definido
    if (search && search.trim() !== '') {
      whereConditions[Op.or] = [
        { title: { [Op.like]: `%${search}%` } },
        { author: { [Op.like]: `%${search}%` } },
        { description: { [Op.like]: `%${search}%` } }
      ];
    }

    this.logger.debug(`Finding books with: ${JSON.stringify({
      whereConditions,
      page,
      limit,
      sortBy,
      sortDirection
    })}`);

    // Realizar la consulta con paginación y ordenación
    const offset = (page - 1) * limit;
    
    const { rows: books, count: total } = await this.bookModel.findAndCountAll({
      where: whereConditions,
      limit,
      offset,
      order: [[sortBy, sortDirection]],
    });

    // Calcular información de paginación
    const totalPages = Math.ceil(total / limit);
    const hasNextPage = page < totalPages;
    const hasPreviousPage = page > 1;

    return {
      data: books,
      pagination: {
        total,
        page,
        limit,
        totalPages,
        hasNextPage,
        hasPreviousPage,
      }
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