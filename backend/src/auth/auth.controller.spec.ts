import { Test, TestingModule } from '@nestjs/testing'
import { AuthController } from './auth.controller'
import { LoginDto } from './dto/login.dto'
import { RegisterDto } from './dto/register.dto'
import { UserRole } from 'src/users/models/user.model'

// Creamos un mock completo de AuthService
class MockAuthService {
  login = jest.fn()
  register = jest.fn()
}

jest.mock('src/users/users.service', () => ({
  UsersService: jest.fn().mockImplementation(() => ({
    findByEmail: jest.fn(),
    create: jest.fn(),
  })),
}))

describe('AuthController', () => {
  let controller: AuthController
  let authService: MockAuthService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: 'AuthService', // Usar el nombre exacto que espera el controlador
          useClass: MockAuthService,
        },
      ],
    }).compile()

    controller = module.get<AuthController>(AuthController)
    authService = module.get('AuthService')

    // Limpiamos los mocks antes de cada test
    jest.clearAllMocks()
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })

  describe('login', () => {
    it('should call authService.login with loginDto and return the result', async () => {
      // Arrange
      const loginDto: LoginDto = {
        email: 'test@example.com',
        password: 'password123',
      }

      const expectedResult = {
        access_token: 'test-token',
        user: { id: 1, email: 'test@example.com' },
      }

      authService.login.mockResolvedValue(expectedResult)

      // Act
      const result = await controller.login(loginDto)

      // Assert
      expect(authService.login).toHaveBeenCalledWith(loginDto)
      expect(authService.login).toHaveBeenCalledTimes(1)
      expect(result).toEqual(expectedResult)
    })

    it('should handle login errors', async () => {
      // Arrange
      const loginDto: LoginDto = {
        email: 'test@example.com',
        password: 'wrong-password',
      }

      const error = new Error('Invalid credentials')
      authService.login.mockRejectedValue(error)

      // Act & Assert
      await expect(controller.login(loginDto)).rejects.toThrow(error)
      expect(authService.login).toHaveBeenCalledWith(loginDto)
      expect(authService.login).toHaveBeenCalledTimes(1)
    })
  })

  describe('register', () => {
    it('should call authService.register with registerDto and return the result', async () => {
      // Arrange
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

      authService.register.mockResolvedValue(expectedResult)

      // Act
      const result = await controller.register(registerDto)

      // Assert
      expect(authService.register).toHaveBeenCalledWith(registerDto)
      expect(authService.register).toHaveBeenCalledTimes(1)
      expect(result).toEqual(expectedResult)
    })

    it('should handle registration errors', async () => {
      // Arrange
      const registerDto: RegisterDto = {
        email: 'existing@example.com',
        password: 'password123',
        fullName: 'Test User',
        role: UserRole.CLIENT,
      }

      const error = new Error('User already exists')
      authService.register.mockRejectedValue(error)

      // Act & Assert
      await expect(controller.register(registerDto)).rejects.toThrow(error)
      expect(authService.register).toHaveBeenCalledWith(registerDto)
      expect(authService.register).toHaveBeenCalledTimes(1)
    })
  })
})
