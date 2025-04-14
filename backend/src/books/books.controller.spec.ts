import { Test, TestingModule } from '@nestjs/testing'
import { BooksController } from './books.controller'
import { BooksService } from './books.service'
import { CreateBookDto } from './dto/create-book.dto'
import { UpdateBookDto } from './dto/update-book.dto'
import { QueryBooksDto } from './dto/query-books.dto'
import { Response } from 'express'
import * as fs from 'fs'
import { BookGenre } from './models/book.model'

const mockBooksService = {
  create: jest.fn(),
  findAll: jest.fn(),
  findOne: jest.fn(),
  update: jest.fn(),
  remove: jest.fn(),
  exportToCsv: jest.fn(),
}

const mockResponse = () => {
  const res = {} as Response
  res.setHeader = jest.fn().mockReturnValue(res)
  res.status = jest.fn().mockReturnValue(res)
  res.json = jest.fn().mockReturnValue(res)
  return res
}

jest.mock('fs', () => ({
  createReadStream: jest.fn().mockReturnValue({
    pipe: jest.fn(),
    on: jest.fn().mockImplementation((event, callback) => {
      if (event === 'end') callback()
      return this
    }),
  }),
  unlinkSync: jest.fn(),
}))

describe('BooksController', () => {
  let controller: BooksController
  let service: BooksService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BooksController],
      providers: [
        {
          provide: BooksService,
          useValue: mockBooksService,
        },
      ],
    }).compile()

    controller = module.get<BooksController>(BooksController)
    service = module.get<BooksService>(BooksService)
    jest.clearAllMocks()
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })

  describe('create', () => {
    it('should create a new book', async () => {
      const createBookDto: CreateBookDto = {
        title: 'Test Book',
        author: 'Test Author',
        isbn: '1234567890123',
        price: 29.99,
        description: 'A test book description',
        genre: BookGenre.FICTION,
        availability: true,
        stock: 3,
        publisher: 'Test Publisher',
      }

      const expectedResult = {
        id: 'book-id',
        ...createBookDto,
        createdAt: new Date(),
        updatedAt: new Date(),
        isDeleted: false,
      }

      mockBooksService.create.mockResolvedValue(expectedResult)

      const result = await controller.create(createBookDto)

      expect(service.create).toHaveBeenCalledWith(createBookDto)
      expect(result).toEqual(expectedResult)
    })
  })

  describe('findAll', () => {
    it('should return all books with pagination', async () => {
      const queryDto: QueryBooksDto = {
        page: 1,
        limit: 10,
        search: 'test',
        sortBy: 'title',
      }

      const expectedResult = {
        data: [
          {
            id: 'book-id-1',
            title: 'Test Book 1',
            author: 'Author 1',
            isbn: '1234567890123',
            price: 29.99,
            description: 'A test book description',
            genre: BookGenre.FICTION,
            publisher: 'Test Publisher',
            availability: true,
            stock: 3,
            createdAt: new Date(),
            updatedAt: new Date(),
            isDeleted: false,
          },
        ],
        pagination: {
          total: 1,
          page: 1,
          limit: 10,
          totalPages: 1,
          hasNextPage: false,
          hasPreviousPage: false,
        },
      }

      mockBooksService.findAll.mockResolvedValue(expectedResult)

      const result = await controller.findAll(queryDto)

      expect(service.findAll).toHaveBeenCalledWith(queryDto)
      expect(result).toEqual(expectedResult)
    })
  })

  describe('findOne', () => {
    it('should return a book by id', async () => {
      const bookId = 'book-id'
      const expectedResult = {
        id: bookId,
        title: 'Test Book',
        author: 'Test Author',
        isbn: '1234567890123',
        price: 29.99,
        description: 'A test book description',
        genre: BookGenre.FICTION,
        availability: true,
        stock: 3,
        publisher: 'Test Publisher',
        createdAt: new Date(),
        updatedAt: new Date(),
        isDeleted: false,
      }

      mockBooksService.findOne.mockResolvedValue(expectedResult)

      const result = await controller.findOne(bookId)

      expect(service.findOne).toHaveBeenCalledWith(bookId)
      expect(result).toEqual(expectedResult)
    })
  })

  describe('update', () => {
    it('should update a book', async () => {
      const bookId = 'book-id'
      const updateBookDto: UpdateBookDto = {
        title: 'Updated Book Title',
        price: 39.99,
      }

      const expectedResult = {
        id: bookId,
        title: 'Updated Book Title',
        author: 'Test Author',
        isbn: '1234567890123',
        price: 39.99,
        description: 'A test book description',
        genre: BookGenre.FICTION,
        availability: true,
        stock: 3,
        publisher: 'Test Publisher',
        createdAt: new Date(),
        updatedAt: new Date(),
        isDeleted: false,
      }

      mockBooksService.update.mockResolvedValue(expectedResult)

      const result = await controller.update(bookId, updateBookDto)

      expect(service.update).toHaveBeenCalledWith(bookId, updateBookDto)
      expect(result).toEqual(expectedResult)
    })
  })

  describe('remove', () => {
    it('should remove a book', async () => {
      const bookId = 'book-id'
      mockBooksService.remove.mockResolvedValue(undefined)

      const result = await controller.remove(bookId)

      expect(service.remove).toHaveBeenCalledWith(bookId)
      expect(result).toEqual({ message: 'Book successfully deleted' })
    })
  })
})
