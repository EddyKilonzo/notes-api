import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateNotesDto } from './dto/create.notes.dto';
import { Pool } from 'pg';
import { Note } from './interface/notes.interface';
import { v4 as uuidv4 } from 'uuid';
import { UpdateNoteDto } from './dto/update.notes.dto';
import { ConnectionService } from '../../database/connection.service';

@Injectable()
export class NotesService {
  constructor(private readonly connectionService: ConnectionService) {}

  private get pool(): Pool {
    return this.connectionService.getPool();
  }

  async create(data: CreateNotesDto, userId: number): Promise<Note> {
    const id = uuidv4();
    const createdAt = new Date();

    const existingNote = await this.pool.query(
      `SELECT * FROM notes WHERE title = $1 AND content = $2`,
      [data.title, data.content],
    );
    if (existingNote.rows.length > 0) {
      throw new Error(
        `Note with the ${data.title} and ${data.content} already exists`,
      );
    }
    try {
      console.log('Creating note...');
      const query = `INSERT INTO notes (id, title, content, created_at, user_id) VALUES ($1, $2, $3, $4, $5) RETURNING *`;
      const params = [id, data.title, data.content, createdAt, userId];
      const result = await this.pool.query(query, params);
      console.log(`Created note with ID: ${data.title}`);
      return result.rows[0] as Note;
    } catch (error) {
      console.error('Error creating note:', error);
      if (error instanceof Error) {
        throw new Error('Failed to create note');
      } else {
        throw error;
      }
    }
  }

  async findAll(userId: number): Promise<Note[]> {
    try {
      const query =
        'SELECT * FROM notes WHERE user_id = $1 ORDER BY created_at DESC';
      const result = await this.pool.query(query, [userId]);
      return result.rows as Note[];
    } catch (error) {
      if (error instanceof Error) {
        throw new Error('Failed to fetch notes');
      } else {
        throw error;
      }
    }
  }

  async findOne(id: string, userId: number): Promise<Note> {
    try {
      const query = 'SELECT * FROM notes WHERE id = $1 AND user_id = $2';
      const result = await this.pool.query(query, [id, userId]);
      if (result.rows.length === 0) {
        throw new NotFoundException('Note not found');
      }
      return result.rows[0] as Note;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error('Failed to fetch note');
      } else {
        throw error;
      }
    }
  }

  async update(id: string, data: UpdateNoteDto, userId: number): Promise<Note> {
    const existingNote = await this.pool.query(
      `SELECT * FROM notes WHERE title = $1 AND content = $2`,
      [data.title, data.content],
    );
    if (existingNote.rows.length > 0) {
      throw new Error(
        `Note with the ${data.title} and ${data.content} already exists`,
      );
    }
    try {
      const query = `UPDATE notes SET title = $1, content = $2, updated_at = CURRENT_TIMESTAMP WHERE id = $3 AND user_id = $4 RETURNING *`;
      const result = await this.pool.query(query, [
        data.title,
        data.content,
        id,
        userId,
      ]);
      if (result.rows.length === 0) {
        throw new NotFoundException('Note not found');
      }
      return result.rows[0] as Note;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error('Failed to update note');
      } else {
        throw error;
      }
    }
  }

  async delete(id: string, userId: number): Promise<void> {
    try {
      const query = 'DELETE FROM notes WHERE id = $1 AND user_id = $2';
      const result = await this.pool.query(query, [id, userId]);
      if (result.rowCount === 0) {
        throw new NotFoundException('Note not found');
      }
    } catch (error) {
      if (error instanceof Error) {
        throw new Error('Failed to delete note');
      } else {
        throw error;
      }
    }
  }
}
