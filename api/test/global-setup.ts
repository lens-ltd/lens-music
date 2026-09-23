import { PostgreSqlContainer } from '@testcontainers/postgresql';

/**
 * Starts one Postgres container for the whole e2e run and exposes it through
 * the same env vars the app reads. Stopped in `global-teardown.ts`.
 */
export default async function globalSetup(): Promise<void> {
  const container = await new PostgreSqlContainer('postgres:16-alpine').start();

  Object.assign(process.env, {
    NODE_ENV: 'test',
    DB_HOST: container.getHost(),
    DB_PORT: String(container.getPort()),
    DB_USER: container.getUsername(),
    DB_PASSWORD: container.getPassword(),
    DB_NAME: container.getDatabase(),
    JWT_SECRET: 'e2e-test-secret-that-is-long-enough-000',
    APP_URL: 'http://localhost:5173',
    CLOUDINARY_CLOUD_NAME: 'test',
    CLOUDINARY_API_KEY: 'test',
    CLOUDINARY_API_SECRET: 'test',
    RESEND_API_KEY: 're_test',
    RESEND_FROM_EMAIL: 'test@lens.test',
    LOG_LEVEL: 'silent',
  });

  (globalThis as { __PG_CONTAINER__?: unknown }).__PG_CONTAINER__ = container;
}
