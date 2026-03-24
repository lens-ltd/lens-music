import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddCoverArtDimensionsToReleases1711286400000 implements MigrationInterface {
  name = 'AddCoverArtDimensionsToReleases1711286400000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE "releases" ADD "cover_art_width" integer',
    );
    await queryRunner.query(
      'ALTER TABLE "releases" ADD "cover_art_height" integer',
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE "releases" DROP COLUMN "cover_art_height"',
    );
    await queryRunner.query(
      'ALTER TABLE "releases" DROP COLUMN "cover_art_width"',
    );
  }
}
