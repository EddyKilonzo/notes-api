import { Module } from '@nestjs/common';
import { NotesController } from './notes.controller';
import { NotesService } from './notes.services';
import { ConnectionService } from 'database/connection.service';

@Module({
  controllers: [NotesController],
  providers: [NotesService, ConnectionService],
})
export class NotesModule {}
