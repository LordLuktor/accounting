import knex from 'knex';
import dotenv from 'dotenv';

dotenv.config();

const config = {
  client: 'postgresql',
  connection: {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432'),
    user: process.env.DB_USER || 'accuflow',
    password: process.env.DB_PASSWORD || 'password',
    database: process.env.DB_NAME || 'accuflow',
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
  },
  pool: {
    min: 2,
    max: 10
  },
  migrations: {
    tableName: 'knex_migrations',
    directory: './migrations'
  },
  seeds: {
    directory: './seeds'
  }
};

const db = knex(config);

export default db;
export { config };