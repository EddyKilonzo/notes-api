import { Injectable } from '@nestjs/common';
import { CreateNotesDto } from './dto/create.notes.dto';
import { Pool } from 'pg';
import { Note } from './interface/notes.interface';
import { v4 as uuidv4 } from 'uuid';
import { UpdateNoteDto } from './dto/update.notes.dto';

@Injectable()
export class NotesService {
  private pool: Pool;

  async create(data: CreateNotesDto): Promise<Note> {
    const id = uuidv4();
    try {
      const query = `INSERT INTO notes (id, title, content) VALUES ($1, $2) RETURNING *`;
      const result = await this.pool.query(query, [
        id,
        data.title,
        data.content,
      ]);
      return result.rows[0] as Note;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error('Failed to create note');
      } else {
        throw error;
      }
    }
  }

  async findAll(): Promise<Note[]> {
    try {
      const query = 'SELECT * FROM notes';
      const result = await this.pool.query(query);
      return result.rows as Note[];
    } catch (error) {
      if (error instanceof Error) {
        throw new Error('Failed to fetch notes');
      } else {
        throw error;
      }
    }
  }
  async findOne(id: string): Promise<Note> {
    try {
      const query = 'SELECT * FROM notes WHERE id = $1';
      const result = await this.pool.query(query, [id]);
      return result.rows[0] as Note;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error('Failed to fetch note');
      } else {
        throw error;
      }
    }
  }
  async update(id: string, data: UpdateNoteDto): Promise<Note> {
    try {
      const query = `UPDATE notes SET title = $1, content = $2 WHERE id = $3 RETURNING *`;
      const result = await this.pool.query(query, [
        data.title,
        data.content,
        id,
      ]);
      return result.rows[0] as Note;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error('Failed to update note');
      } else {
        throw error;
      }
    }
  }
  async delete(id: string): Promise<void> {
    try {
      const query = 'DELETE FROM notes WHERE id = $1';
      await this.pool.query(query, [id]);
    } catch (error) {
      if (error instanceof Error) {
        throw new Error('Failed to delete note');
      } else {
        throw error;
      }
    }
  }
}
