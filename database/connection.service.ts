/* eslint-disable prettier/prettier */
import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { Pool, PoolClient } from 'pg';
import { createDbPool } from "./config/database.config";    

@Injectable()
export class ConnectionService implements OnModuleInit, OnModuleDestroy {
    private pool: Pool;

    async onModuleInit() {
        this.pool = createDbPool();
        await this.testConnection();
    }

    async onModuleDestroy() {
        await this.pool.end();
    }

    async testConnection(): Promise<void> {
        try {
            const client: PoolClient = await this.pool.connect();
            await client.query('SELECT 1');
            client.release();
            console.log('Connected to the database');
            client.release();
        } catch (error) {
            console.error('Error connecting to the database:', error);
            throw error;
        }
  }
}
