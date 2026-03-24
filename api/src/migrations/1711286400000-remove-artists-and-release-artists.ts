import { MigrationInterface, QueryRunner } from 'typeorm';

export class RemoveArtistsAndReleaseArtists1711286400000
  implements MigrationInterface
{
  name = 'RemoveArtistsAndReleaseArtists1711286400000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      INSERT INTO contributors (
        id,
        created_at,
        updated_at,
        created_by_id,
        name,
        display_name
      )
      SELECT
        a.id,
        COALESCE(a.created_at, NOW()),
        COALESCE(a.updated_at, NOW()),
        a.created_by_id,
        TRIM(a.name),
        TRIM(a.name)
      FROM artists a
      WHERE a.name IS NOT NULL
        AND TRIM(a.name) <> ''
        AND NOT EXISTS (
          SELECT 1
          FROM contributors c
          WHERE LOWER(TRIM(c.name)) = LOWER(TRIM(a.name))
        );
    `);

    await queryRunner.query('DROP TABLE IF EXISTS release_artists CASCADE;');
    await queryRunner.query('DROP TABLE IF EXISTS artists CASCADE;');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DO $$
      BEGIN
        IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'artists_status_enum') THEN
          CREATE TYPE artists_status_enum AS ENUM ('active', 'inactive');
        END IF;
      END$$;
    `);

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS artists (
        id uuid PRIMARY KEY,
        created_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
        created_by_id uuid NULL,
        name character varying NOT NULL,
        status artists_status_enum NOT NULL DEFAULT 'active',
        user_id uuid NOT NULL
      );
    `);

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS release_artists (
        id uuid PRIMARY KEY,
        created_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
        created_by_id uuid NULL,
        release_id uuid NOT NULL,
        artist_id uuid NOT NULL
      );
    `);
  }
}
