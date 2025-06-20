import { Injectable } from '@nestjs/common';
import { ConnectionService } from './connection.service';

@Injectable()
export class DatabaseService {
  constructor(private readonly connectionService: ConnectionService) {}

  async query(text: string, params?: any[]): Promise<any[]> {
    const client = await this.connectionService.getPool().connect();
    try {
      const result = await client.query(text, params);
      return result.rows;
    } finally {
      client.release();
    }
  }
}
