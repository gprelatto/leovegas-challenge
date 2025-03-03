import { Module } from '@nestjs/common';
import { ApiModule } from './api/api.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as ormConfig from '../ormconfig';

@Module({
  imports: [TypeOrmModule.forRoot(ormConfig), ApiModule],
})
export class AppModule {}
