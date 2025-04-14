import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/sequelize';
import { NotFoundException } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import { Op } from 'sequelize';
import { BooksService } from './books.service';
import { Book, BookGenre } from './models/book.model';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { QueryBooksDto } from './dto/query-books.dto';


jest.mock('csv-writer', () => ({
  createObjectCsvWriter: jest.fn().mockImplementation(() => ({
    writeRecords: jest.fn().mockResolvedValue(undefined),
  })),
}));

jest.mock('fs', () => ({
  existsSync: jest.fn(),
  mkdirSync: jest.fn(),
}));

jest.mock('path', () => ({
  join: jest.fn().mockReturnValue('/mocked/path'),
}));

jest.mock('uuid', () => ({
  v4: jest.fn().mockReturnValue('mocked-uuid'),
}));

describe('BooksService', () => {
  let service: BooksService;
  let mockBookModel: any;

  beforeEach(async () => {
    mockBookModel = {
      create: jest.fn(),
      findAll: jest.fn(),
      findByPk: jest.fn(),
      findAndCountAll: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BooksService,
        {
          provide: getModelToken(Book),
          useValue: mockBookModel,
        },
      ],
    }).compile();

    service = module.get<BooksService>(BooksService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new book', async () => {
      const createBookDto: CreateBookDto = {
        title: 'Test Book',
        author: 'Test Author',
        publisher: 'Test Publisher',
        price: 29.99,
        genre: BookGenre.FICTION,
         availability: true,
        stock: 10,
        description: 'A test book description',
        isbn: '1234567890123',
      };

      const mockBook = {
        id: 'test-uuid',
        ...createBookDto,
        availability: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockBookModel.create.mockResolvedValue(mockBook);

      const result = await service.create(createBookDto);

      expect(mockBookModel.create).toHaveBeenCalledWith(createBookDto);
      expect(result).toEqual(mockBook);
    });
  });

  describe('findAll', () => {
    it('should return all books with pagination (default parameters)', async () => {
      const queryDto = new QueryBooksDto();
      const mockBooks = [
        {
          id: 'book-1',
          title: 'Book 1',
          author: 'Author 1',
          publisher: 'Publisher 1',
          price: 19.99,
          availability: true,
          genre: BookGenre.FICTION,
          stock: 5,
          description: 'Description 1',
          isbn: '1111111111111',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      mockBookModel.findAndCountAll.mockResolvedValue({
        rows: mockBooks,
        count: 1,
      });

      const result = await service.findAll(queryDto);

      expect(mockBookModel.findAndCountAll).toHaveBeenCalledWith({
        where: {},
        limit: 10,
        offset: 0,
        order: [['createdAt', 'asc']],
      });

      expect(result).toEqual({
        data: mockBooks,
        pagination: {
          total: 1,
          page: 1,
          limit: 10,
          totalPages: 1,
          hasNextPage: false,
          hasPreviousPage: false,
        },
      });
    });

    it('should apply filters when provided', async () => {
      const queryDto: QueryBooksDto = {
        page: 2,
        limit: 5,
        sortBy: 'title',
        sortDirection: 'desc',
        search: 'test',
        title: 'Book Title',
        author: 'Book Author',
        publisher: 'Book Publisher',
        genre: BookGenre.FICTION,
        availability: true,
      };

      const mockBooks = [
        {
          id: 'book-1',
          title: 'Book Title',
          author: 'Book Author',
          publisher: 'Book Publisher',
          price: 19.99,
          availability: true,
          genre: BookGenre.FICTION,
          stock: 5,
          description: 'Description 1',
          isbn: '1111111111111',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      mockBookModel.findAndCountAll.mockResolvedValue({
        rows: mockBooks,
        count: 11,
      });

      const result = await service.findAll(queryDto);

      expect(mockBookModel.findAndCountAll).toHaveBeenCalledWith({
        where: {
          title: { [Op.like]: '%Book Title%' },
          author: { [Op.like]: '%Book Author%' },
          publisher: { [Op.like]: '%Book Publisher%' },
          genre: BookGenre.FICTION,
          availability: false, 
          [Op.or]: [
            { title: { [Op.like]: '%test%' } },
            { author: { [Op.like]: '%test%' } },
            { description: { [Op.like]: '%test%' } },
          ],
        },
        limit: 5,
        offset: 5,  // (page - 1) * limit = (2 - 1) * 5 = 5
        order: [['title', 'desc']],
      });

      expect(result).toEqual({
        data: mockBooks,
        pagination: {
          total: 11,
          page: 2,
          limit: 5,
          totalPages: 3,
          hasNextPage: true,
          hasPreviousPage: true,
        },
      });
    });
  });

  describe('findOne', () => {
    it('should return a book by id', async () => {
      const bookId = 'test-uuid';
      const mockBook = {
        id: bookId,
        title: 'Test Book',
        author: 'Test Author',
        publisher: 'Test Publisher',
        price: 29.99,
        availability: true,
        genre: BookGenre.FICTION,
        stock: 10,
        description: 'A test book description',
        isbn: '1234567890123',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockBookModel.findByPk.mockResolvedValue(mockBook);

      const result = await service.findOne(bookId);

      expect(mockBookModel.findByPk).toHaveBeenCalledWith(bookId);
      expect(result).toEqual(mockBook);
    });

    it('should throw NotFoundException when book not found', async () => {
      const bookId = 'non-existent-id';
      mockBookModel.findByPk.mockResolvedValue(null);

      await expect(service.findOne(bookId)).rejects.toThrow(
        new NotFoundException(`Book with ID ${bookId} not found`)
      );
    });
  });

  describe('update', () => {
    it('should update a book', async () => {
      const bookId = 'test-uuid';
      const updateBookDto: UpdateBookDto = {
        title: 'Updated Title',
        price: 39.99,
      };

      const mockBook = {
        id: bookId,
        title: 'Original Title',
        author: 'Test Author',
        publisher: 'Test Publisher',
        price: 29.99,
        availability: true,
        genre: BookGenre.FICTION,
        stock: 10,
        description: 'A test book description',
        isbn: '1234567890123',
        createdAt: new Date(),
        updatedAt: new Date(),
        update: jest.fn().mockImplementation(function (dto) {
          Object.assign(this, dto);
          return Promise.resolve(this);
        }),
      };

      mockBookModel.findByPk.mockResolvedValue(mockBook);

      const result = await service.update(bookId, updateBookDto);

      expect(mockBookModel.findByPk).toHaveBeenCalledWith(bookId);
      expect(mockBook.update).toHaveBeenCalledWith(updateBookDto);
      expect(result.title).toEqual('Updated Title');
      expect(result.price).toEqual(39.99);
    });

    it('should throw NotFoundException when trying to update non-existent book', async () => {
      const bookId = 'non-existent-id';
      const updateBookDto: UpdateBookDto = {
        title: 'Updated Title',
      };

      mockBookModel.findByPk.mockResolvedValue(null);

      await expect(service.update(bookId, updateBookDto)).rejects.toThrow(
        new NotFoundException(`Book with ID ${bookId} not found`)
      );
    });
  });

  describe('remove', () => {
    it('should remove a book', async () => {
      const bookId = 'test-uuid';
      const mockBook = {
        id: bookId,
        destroy: jest.fn().mockResolvedValue(undefined),
      };

      mockBookModel.findByPk.mockResolvedValue(mockBook);

      await service.remove(bookId);

      expect(mockBookModel.findByPk).toHaveBeenCalledWith(bookId);
      expect(mockBook.destroy).toHaveBeenCalled();
    });

    it('should throw NotFoundException when trying to remove non-existent book', async () => {
      const bookId = 'non-existent-id';
      mockBookModel.findByPk.mockResolvedValue(null);

      await expect(service.remove(bookId)).rejects.toThrow(
        new NotFoundException(`Book with ID ${bookId} not found`)
      );
    });
  });

 /* describe('exportToCsv', () => {
    it('should export books to CSV file', async () => {
      const mockBooks = [
        {
          id: 'book-1',
          title: 'Book 1',
          author: 'Author 1',
          publisher: 'Publisher 1',
          price: 19.99,
          availability: true,
          genre: BookGenre.FICTION,
          stock: 5,
          description: 'Description 1',
          isbn: '1111111111111',
          createdAt: new Date(),
          updatedAt: new Date(),
          toJSON: jest.fn().mockReturnThis(),
        },
      ];

      mockBookModel.findAll.mockResolvedValue(mockBooks);
      (fs.existsSync as jest.Mock).mockReturnValue(false);

      const result = await service.exportToCsv();

      expect(fs.existsSync).toHaveBeenCalledWith('/mocked/path');
      expect(fs.mkdirSync).toHaveBeenCalledWith('/mocked/path');

      expect(result).toEqual('/mocked/path');


      expect(mockBookModel.findAll).toHaveBeenCalled();

      expect(mockBooks[0].toJSON).toHaveBeenCalled();
    });

    it('should not create temp directory if it already exists', async () => {
      const mockBooks = [
        {
          id: 'book-1',
          toJSON: jest.fn().mockReturnThis(),
        },
      ];

      mockBookModel.findAll.mockResolvedValue(mockBooks);
      (fs.existsSync as jest.Mock).mockReturnValue(false);

      await service.exportToCsv();

      expect(fs.existsSync).toHaveBeenCalledWith('/mocked/path');
      expect(fs.mkdirSync).not.toHaveBeenCalled();
    });
  });*/
});