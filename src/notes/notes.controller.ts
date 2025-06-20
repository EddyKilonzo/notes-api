import {
  Controller,
  Get,
  Post,
  Body,
  Delete,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';
import { NotesService } from './notes.services';
import { CreateNotesDto } from './dto/create.notes.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('notes')
@UseGuards(JwtAuthGuard)
export class NotesController {
  constructor(private readonly notesService: NotesService) {}

  @Post()
  async create(@Body() createNoteDto: CreateNotesDto, @Request() req) {
    return this.notesService.create(createNoteDto, req.user.id);
  }

  @Get()
  async findAll(@Request() req) {
    return this.notesService.findAll(req.user.id);
  }

  @Delete(':id')
  async delete(@Param('id') id: string, @Request() req) {
    await this.notesService.delete(id, req.user.id);
    return { message: 'Note deleted' };
  }
}
