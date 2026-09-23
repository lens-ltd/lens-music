import { Client } from 'pg';
import { StartedPostgreSqlContainer } from '@testcontainers/postgresql';
import { externalServerSettings } from './global-setup';

export default async function globalTeardown(): Promise<void> {
  const database = process.env.E2E_CREATED_DB;
  if (database) {
    const { adminDatabase, ...server } = externalServerSettings();
    const client = new Client({ ...server, database: adminDatabase });
    await client.connect();
    await client.query(`DROP DATABASE IF EXISTS "${database}" WITH (FORCE)`);
    await client.end();
  }

  const container = (globalThis as { __PG_CONTAINER__?: StartedPostgreSqlContainer })
    .__PG_CONTAINER__;
  await container?.stop();
}
