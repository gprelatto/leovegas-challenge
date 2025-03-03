import { typeorm } from 'config';
import { DataSource, DataSourceOptions } from 'typeorm';
import { typeormData } from 'typeorm.object';

const options = {
  ...typeormData,
  entities: [__dirname + '/src/**/*.entity{.ts,.js}'],
  migrations: ['./src/migrations/**/*{.ts,.js}'],
} as DataSourceOptions;

export const dataSource = new DataSource(options);
