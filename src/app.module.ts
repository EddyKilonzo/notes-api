import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { NotesModule } from './notes/notes.module';
import { DatabaseModule } from '../database/database.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [DatabaseModule, NotesModule, AuthModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
