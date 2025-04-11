import { QueryInterface } from 'sequelize';

export async function up(queryInterface: QueryInterface): Promise<void> {
  await queryInterface.bulkInsert('Books', [
    {
      title: '1984',
      author: 'George Orwell',
      editorial: 'Secker & Warburg',
      price: 10990,
      availability: true,
      genre: 'Ficción',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      title: 'Cien Años de Soledad',
      author: 'Gabriel García Márquez',
      editorial: 'Sudamericana',
      price: 12990,
      availability: true,
      genre: 'Realismo mágico',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ]);
}

export async function down(queryInterface: QueryInterface): Promise<void> {
  await queryInterface.bulkDelete('Books', {}, {});
}
