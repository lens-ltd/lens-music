# Lens Music

API for Lens Music - a music distribution service.

## Testing

```bash
npm test            # unit tests (src/**/*.spec.ts), no database
npm run typecheck   # includes test files
npm run test:e2e    # boots the full app against a throwaway Postgres
```

`test:e2e` needs Postgres. With Docker running, it starts a `postgres:16-alpine` container (testcontainers). Without Docker, point it at any Postgres server. It creates a `lens_e2e_<timestamp>` database there and drops it afterwards:

```bash
E2E_DB_HOST=localhost E2E_DB_USER=$USER npm run test:e2e
# also: E2E_DB_PORT (5432), E2E_DB_PASSWORD, E2E_DB_NAME (admin database, default "postgres")
```

Outgoing email is stubbed in e2e runs (`test/utils/create-test-app.ts`).
