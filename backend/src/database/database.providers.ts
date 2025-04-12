import { Sequelize } from 'sequelize-typescript';
import { ConfigService } from '@nestjs/config';
import { Book } from '../books/models/book.model';
import { User } from 'src/users/models/user.model';

export const databaseProviders = [
  {
    provide: 'SEQUELIZE',
    useFactory: async (configService: ConfigService) => {
      const sequelize = new Sequelize({
        dialect: 'postgres',
        host: configService.get('database.host'),
        port: configService.get('database.port'),
        username: configService.get('database.username'),
        password: configService.get('database.password'),
        database: configService.get('database.database'),
        logging: configService.get('database.logging'),
        define: {
          timestamps: true,
          paranoid: true, // Enable soft deletes
        },
      });

      sequelize.addModels([Book, User]);
      await sequelize.sync();
      return sequelize;
    },
    inject: [ConfigService],
  },
];
