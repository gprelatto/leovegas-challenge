import { DB_DATABASE } from 'config';

export const typeormData = {
  type: 'sqlite',
  database: DB_DATABASE,
  synchronize: false,
  logging: ['error'],
  timezone: 'Z',
  multipleStatements: true,
  ssl: false,
}