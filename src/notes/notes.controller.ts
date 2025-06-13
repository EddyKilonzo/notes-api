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
  ConflictException,
} from '@nestjs/common';
import { NotesService } from './notes.services';
import { CreateNotesDto } from './dto/create.notes.dto';
import { UpdateNoteDto } from './dto/update.notes.dto';
import { ApiResponse } from 'shared/api-response';
import { Note } from './interface/notes.interface';
import {
  ApiTags,
  ApiOperation,
  ApiResponse as SwaggerApiResponse,
} from '@nestjs/swagger';

@ApiTags('Notes')
@Controller('notes')
export class NotesController {
  constructor(private readonly notesService: NotesService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new note' })
  @SwaggerApiResponse({
    status: HttpStatus.CREATED,
    description: 'Note created successfully',
  })
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
      if (error instanceof ConflictException) {
        return {
          success: false,
          message: error.message,
          errors: 'Duplicate note',
        };
      }
      return {
        success: false,
        message: 'Failed to create note',
        errors: (error as Error).message || 'An unknown error occurred',
      };
    }
  }

  @Get('')
  @ApiOperation({ summary: 'Get all notes' })
  @SwaggerApiResponse({
    status: HttpStatus.OK,
    description: 'Notes retrieved successfully',
  })
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
  @ApiOperation({ summary: 'Get a note by ID' })
  @SwaggerApiResponse({
    status: HttpStatus.OK,
    description: 'Note retrieved successfully',
  })
  @SwaggerApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Note not found',
  })
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
  @ApiOperation({ summary: 'Update a note by ID' })
  @SwaggerApiResponse({
    status: HttpStatus.OK,
    description: 'Note updated successfully',
  })
  @SwaggerApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Note not found',
  })
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
  @ApiOperation({ summary: 'Delete a note by ID' })
  @SwaggerApiResponse({
    status: HttpStatus.OK,
    description: 'Note deleted successfully',
  })
  @SwaggerApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Note not found',
  })
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
