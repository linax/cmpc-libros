import { Dialect } from 'sequelize';
import * as dotenv from 'dotenv';
dotenv.config();

interface SequelizeConfig {
  [key: string]: {
    dialect: Dialect;
    host: string;
    port: number;
    username: string;
    password: string;
    database: string;
    logging: boolean | ((sql: string) => void);
  };
}

const config: SequelizeConfig = {
  development: {
    dialect: 'postgres',
    host: process.env.DATABASE_HOST || 'postgres',
    port: parseInt(process.env.DATABASE_PORT || '5432'),
    username: process.env.DATABASE_USERNAME || 'postgres',
    password: process.env.DATABASE_PASSWORD || 'postgres',
    database: process.env.DATABASE_NAME || 'cmpc_books',
    logging: false,
  },
};

export = config;
