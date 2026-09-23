import { Client } from 'pg';
import { PostgreSqlContainer } from '@testcontainers/postgresql';

interface DbSettings {
  host: string;
  port: number;
  user: string;
  password: string;
  database: string;
}

/** Admin connection to an existing server, used to create/drop the throwaway DB. */
export const externalServerSettings = (): Omit<DbSettings, 'database'> & { adminDatabase: string } => ({
  host: process.env.E2E_DB_HOST as string,
  port: Number(process.env.E2E_DB_PORT) || 5432,
  user: process.env.E2E_DB_USER || 'postgres',
  password: process.env.E2E_DB_PASSWORD || '',
  adminDatabase: process.env.E2E_DB_NAME || 'postgres',
});

/**
 * Creates a throwaway database on the server named by `E2E_DB_HOST` (local
 * Postgres, or a CI `services: postgres` container).
 */
const useExternalServer = async (): Promise<DbSettings> => {
  const { adminDatabase, ...server } = externalServerSettings();
  const database = `lens_e2e_${Date.now()}`;

  const client = new Client({ ...server, database: adminDatabase });
  await client.connect();
  await client.query(`CREATE DATABASE "${database}"`);
  await client.end();

  process.env.E2E_CREATED_DB = database;
  return { ...server, database };
};

/** Starts one Postgres container for the whole run (needs Docker). */
const useContainer = async (): Promise<DbSettings> => {
  const container = await new PostgreSqlContainer('postgres:16-alpine').start();
  (globalThis as { __PG_CONTAINER__?: unknown }).__PG_CONTAINER__ = container;

  return {
    host: container.getHost(),
    port: container.getPort(),
    user: container.getUsername(),
    password: container.getPassword(),
    database: container.getDatabase(),
  };
};

/**
 * Provides one Postgres database for the whole e2e run and exposes it through
 * the same env vars the app reads. Cleaned up in `global-teardown.ts`.
 */
export default async function globalSetup(): Promise<void> {
  const db = process.env.E2E_DB_HOST ? await useExternalServer() : await useContainer();

  Object.assign(process.env, {
    NODE_ENV: 'test',
    DB_HOST: db.host,
    DB_PORT: String(db.port),
    DB_USER: db.user,
    DB_PASSWORD: db.password,
    DB_NAME: db.database,
    DB_SSL: 'false',
    JWT_SECRET: 'e2e-test-secret-that-is-long-enough-000',
    APP_URL: 'http://localhost:5173',
    CLOUDINARY_CLOUD_NAME: 'test',
    CLOUDINARY_API_KEY: 'test',
    CLOUDINARY_API_SECRET: 'test',
    RESEND_API_KEY: 're_test',
    RESEND_FROM_EMAIL: 'test@lens.test',
    LOG_LEVEL: 'silent',
  });
}
