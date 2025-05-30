import { Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { APP_FILTER } from '@nestjs/core'
import { ConfigModule as AppConfigModule } from './config/config.module'
import { BooksModule } from './books/books.module'
import { LoggingModule } from './shared/logging/logging.module'
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter'
import { AuthModule } from './auth/auth.module'
import { UsersModule } from './users/users.module'

@Module({
  imports: [
    AppConfigModule,
    SequelizeModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        ...configService.get('database'),
      }),
    }),
    BooksModule,
    AuthModule,
     AuthModule,
    UsersModule,
    
    LoggingModule,
  ],
  providers: [
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },
  ],
})
export class AppModule {}
