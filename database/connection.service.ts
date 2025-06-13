/* eslint-disable prettier/prettier */
import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { Pool, PoolClient } from 'pg';
import { createDbPool } from './config/database.config';

@Injectable()
export class ConnectionService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(ConnectionService.name);
  private pool: Pool;

  getPool(): Pool {
    return this.pool;
  }

  async onModuleInit() {
    try {
      this.pool = createDbPool();
      await this.testConnection();
      this.logger.log('Database connection established successfully');
    } catch (error) { 
      if (error instanceof Error) {
        this.logger.error(`Failed to initialize database connection: ${error.message}`, error);
      } else {
        this.logger.error('Failed to initialize database connection with unknown error type', String(error));
      }
      throw error;
    }
  }

  async onModuleDestroy() {
    if (this.pool) {
      try {
        await this.pool.end();
        this.logger.log('Database pool ended successfully');
      } catch (error: unknown) {
        if (error instanceof Error) {
          this.logger.error(`Failed to end database pool: ${error.message}`);
        } else {
          this.logger.error('Failed to end database pool with unknown error type');
        }
      }
    }
  }

  async testConnection(): Promise<void> {
    let client: PoolClient | null = null;
    try {
      client = await this.pool.connect();
      const { rows } = await client.query('SELECT NOW() as current_time');
      this.logger.log(`Database connection test successful. Current DB time: ${rows[0]}`);
    } catch (error: unknown) {
      if (error instanceof Error) {
        this.logger.error(`Database connection test failed: ${error.message}`);
      } else {
        this.logger.error('Database connection test failed with unknown error type');
      }
      throw error;
    } finally {
      if (client) {
        client.release();
      }
    }
  }
}