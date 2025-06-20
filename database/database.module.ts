import { Module } from '@nestjs/common';
import { ConnectionService } from './connection.service';
import { DatabaseService } from './database.service';

@Module({
  providers: [ConnectionService, DatabaseService],
  exports: [ConnectionService, DatabaseService],
})
export class DatabaseModule {} 