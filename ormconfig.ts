import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { typeormData } from 'typeorm.object';

const options = {
  ...typeormData,
  entities: [__dirname + '/src/**/*.entity{.ts,.js}'],
  migrations: [__dirname + '/migrations/*.ts'],
} as TypeOrmModuleOptions;

module.exports = options;
