import {
  Table,
  Column,
  Model,
  DataType,
  CreatedAt,
  UpdatedAt,
  DeletedAt,
} from 'sequelize-typescript';

export enum BookGenre {
  FICTION = 'FICTION',
  NON_FICTION = 'NON_FICTION',
  SCIENCE = 'SCIENCE',
  TECHNOLOGY = 'TECHNOLOGY',
  HISTORY = 'HISTORY',
  BIOGRAPHY = 'BIOGRAPHY',
  CHILDREN = 'CHILDREN',
  ROMANCE = 'ROMANCE',
  THRILLER = 'THRILLER',
  FANTASY = 'FANTASY',
  OTHER = 'OTHER',
}

@Table({
  tableName: 'books',
  timestamps: true,
})
export class Book extends Model {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  id: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    validate: {
      notEmpty: true,
    },
  })
  title: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    validate: {
      notEmpty: true,
    },
  })
  author: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  publisher: string;

  @Column({
    type: DataType.DECIMAL(10, 2),
    allowNull: false,
  })
  price: number;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: true,
  })
  availability: boolean;

  @Column({
    type: DataType.ENUM(...Object.values(BookGenre)),
    allowNull: false,
    defaultValue: BookGenre.OTHER,
  })
  genre: BookGenre;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    defaultValue: 0,
  })
  stock: number;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  description: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  isbn: string;

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;

  @DeletedAt
  deletedAt: Date;
}
