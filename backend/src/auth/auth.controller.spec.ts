/*import { Test, TestingModule } from '@nestjs/testing'
import { HttpStatus } from '@nestjs/common'
import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'
import { LoginDto } from './dto/login.dto'
import { RegisterDto } from './dto/register.dto'
import { UserRole } from 'src/users/models/user.model'

// Mock completo del AuthService
jest.mock('./auth.service')

describe('AuthController', () => {
  let controller: AuthController
  let service: AuthService

  beforeEach(async () => {
    jest.clearAllMocks()

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            login: jest.fn(),
            register: jest.fn(),
          },
        },
      ],
    }).compile()

    controller = module.get<AuthController>(AuthController)
    service = module.get<AuthService>(AuthService)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })

  describe('login', () => {
    it('should call authService.login with loginDto', async () => {
      // Arrange
      const loginDto: LoginDto = {
        email: 'test@example.com',
        password: 'password123',
      }
      const expectedResult = {
        access_token: 'test-token',
        user: { id: 1, email: 'test@example.com' },
      }
      jest.spyOn(service, 'login').mockResolvedValue(expectedResult)

      // Act
      const result = await controller.login(loginDto)

      // Assert
      expect(service.login).toHaveBeenCalledWith(loginDto)
      expect(service.login).toHaveBeenCalledTimes(1)
      expect(result).toEqual(expectedResult)
    })

    it('should handle login failure', async () => {
      const loginDto: LoginDto = {
        email: 'test@example.com',
        password: 'wrong-password',
      }
      const error = new Error('Invalid credentials')
      jest.spyOn(service, 'login').mockRejectedValue(error)

      await expect(controller.login(loginDto)).rejects.toThrow(error)
      expect(service.login).toHaveBeenCalledWith(loginDto)
      expect(service.login).toHaveBeenCalledTimes(1)
    })
  })

  describe('register', () => {
    it('should call authService.register with registerDto', async () => {
      const registerDto: RegisterDto = {
        email: 'new@example.com',
        password: 'password123',
        fullName: 'Test User',
        role: UserRole.CLIENT,
      }
      const expectedResult = {
        id: 1,
        email: 'new@example.com',
        name: 'Test User',
      }
      jest.spyOn(service, 'register').mockResolvedValue(expectedResult)

      // Act
      const result = await controller.register(registerDto)

      // Assert
      expect(service.register).toHaveBeenCalledWith(registerDto)
      expect(service.register).toHaveBeenCalledTimes(1)
      expect(result).toEqual(expectedResult)
    })

    it('should handle registration failure', async () => {
      // Arrange
      const registerDto: RegisterDto = {
        email: 'existing@example.com',
        password: 'password123',
        fullName: 'Test User',
        role: UserRole.CLIENT,
      }
      const error = new Error('User already exists')
      jest.spyOn(service, 'register').mockRejectedValue(error)

      // Act & Assert
      await expect(controller.register(registerDto)).rejects.toThrow(error)
      expect(service.register).toHaveBeenCalledWith(registerDto)
      expect(service.register).toHaveBeenCalledTimes(1)
    })
  })
})*/
