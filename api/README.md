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

## Phone numbers

Phone numbers are stored in E.164 (`+250788123456`). Request DTOs use `@PhoneNumberField()` (`src/helpers/phone.helper.ts`), which normalizes the value and rejects numbers that can't be dialed. A blank value clears the number.

To convert numbers saved before this validation existed:

```bash
npm run phones:backfill            # dry run: lists what would change
npm run phones:backfill -- --apply # writes the changes
```

Local numbers without a calling code are read as Rwandan. Values that still can't be parsed are left unchanged and logged, so they can be fixed by hand.
