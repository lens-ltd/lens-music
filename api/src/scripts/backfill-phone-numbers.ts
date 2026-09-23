import 'dotenv/config';
import 'reflect-metadata';
import { Not, IsNull, type EntityTarget, type ObjectLiteral } from 'typeorm';
import { AppDataSource } from '../data-source';
import { Contributor } from '../entities/contributor.entity';
import { User } from '../entities/user.entity';
import { UserInvitation } from '../entities/user-invitation.entity';
import { normalizePhoneNumber } from '../helpers/phone.helper';
import logger from '../utils/logger';

/**
 * Rewrites stored phone numbers to E.164. Numbers typed before validation
 * existed are free-form; local numbers without a calling code are read as
 * Rwandan. Values that still can't be parsed are left alone and listed so
 * someone can fix them by hand.
 *
 *   npm run phones:backfill            # dry run: report only
 *   npm run phones:backfill -- --apply # write the changes
 */
const TARGETS: Array<{ label: string; entity: EntityTarget<ObjectLiteral> }> = [
  { label: 'users', entity: User },
  { label: 'contributors', entity: Contributor },
  { label: 'user_invitations', entity: UserInvitation },
];

const apply = process.argv.includes('--apply');

const run = async () => {
  await AppDataSource.initialize();
  logger.info(apply ? 'Applying phone number backfill.' : 'Dry run: no rows will be changed.');

  for (const { label, entity } of TARGETS) {
    const repository = AppDataSource.getRepository(entity);
    const rows = await repository.find({
      select: { id: true, phoneNumber: true },
      where: { phoneNumber: Not(IsNull()) },
    });

    let converted = 0;
    let cleared = 0;
    const invalid: Array<{ id: string; phoneNumber: string }> = [];

    for (const row of rows) {
      const current = row.phoneNumber as string;
      const next = normalizePhoneNumber(current, 'RW') as string | null;

      if (next === current) continue;
      if (next !== null && !next.startsWith('+')) {
        invalid.push({ id: row.id, phoneNumber: current });
        continue;
      }

      if (next === null) cleared += 1;
      else converted += 1;
      if (apply) await repository.update(row.id, { phoneNumber: next });
    }

    logger.info(
      { table: label, checked: rows.length, converted, cleared, invalid: invalid.length },
      `${label}: ${converted} converted, ${cleared} blank values cleared, ${invalid.length} could not be parsed`,
    );
    for (const row of invalid) {
      logger.warn({ table: label, ...row }, 'Phone number left unchanged');
    }
  }

  await AppDataSource.destroy();
};

run().catch((err) => {
  logger.error({ err }, 'Phone number backfill failed');
  process.exit(1);
});
