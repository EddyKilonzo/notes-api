/* eslint-disable prettier/prettier */
import { Pool } from 'pg';

export interface DatabaseConfig {
  host: string;
  port: number;
  user: string;
  password: string;
  database: string;
}
export const databaseConfig: DatabaseConfig = {
  host: 'localhost',
  port: 5432,
  user: 'postgres',
  password: 'EB3/56398/21',
  database: 'notebook',
};

export const createDbPool = () => {
  return new Pool({
    host: databaseConfig.host,
    port: databaseConfig.port,
    user: databaseConfig.user,
    password: databaseConfig.password,
    database: databaseConfig.database,
  });
};