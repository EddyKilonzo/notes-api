import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { NotesService } from './notes.services';
import { CreateNotesDto } from './dto/create.notes.dto';
import { UpdateNoteDto } from './dto/update.notes.dto';
import { ApiResponse } from 'shared/api-response';
import { Note } from './interface/notes.interface';

@Controller('notes')
export class NotesController {
  constructor(private readonly notesService: NotesService) {}

  @Post('')
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body() createNoteDto: CreateNotesDto,
  ): Promise<ApiResponse<Note>> {
    try {
      const note = await this.notesService.create(createNoteDto);
      return {
        success: true,
        message: 'Note created successfully',
        data: note,
      };
    } catch (error) {
      return {
        success: false,
        message: 'Failed to create note',
        errors: (error as Error).message || 'An unknown error occurred',
      };
    }
  }

  @Get('')
  async findAll(): Promise<ApiResponse<Note[]>> {
    try {
      const notes = await this.notesService.findAll();
      return {
        success: true,
        message: 'Notes retrieved successfully',
        data: notes,
      };
    } catch (error) {
      return {
        success: false,
        message: 'Failed to retrieve notes',
        errors: (error as Error).message || 'An unknown error occurred',
      };
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<ApiResponse<Note>> {
    try {
      const note = await this.notesService.findOne(id);
      return {
        success: true,
        message: `Note  retrieved successfully`,
        data: note,
      };
    } catch (error) {
      return {
        success: false,
        message: 'Failed to retrieve note',
        errors: (error as Error).message || 'An unknown error occurred',
      };
    }
  }
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateNoteDto: UpdateNoteDto,
  ): Promise<ApiResponse<Note>> {
    try {
      const note = await this.notesService.update(id, updateNoteDto);
      return {
        success: true,
        message: 'Note updated successfully',
        data: note,
      };
    } catch (error) {
      return {
        success: false,
        message: 'Failed to update note',
        errors: (error as Error).message || 'An unknown error occurred',
      };
    }
  }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<ApiResponse<void>> {
    try {
      await this.notesService.delete(id);
      return {
        success: true,
        message: 'Note deleted successfully',
      };
    } catch (error) {
      return {
        success: false,
        message: 'Failed to delete note',
        errors: (error as Error).message || 'An unknown error occurred',
      };
    }
  }
}
