import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { AppModule } from '../../src/app.module';
import { configureApp } from '../../src/app.setup';
import { EmailService } from '../../src/modules/email/email.service';

/**
 * Boots the full AppModule with the production global config. Outgoing email
 * is stubbed at `EmailService.sendEmail`, which every public send method uses.
 */
export const createTestApp = async (): Promise<INestApplication> => {
  jest
    .spyOn(EmailService.prototype as never as { sendEmail: () => Promise<void> }, 'sendEmail')
    .mockResolvedValue(undefined);

  const moduleRef = await Test.createTestingModule({
    imports: [AppModule],
  }).compile();

  const app = configureApp(moduleRef.createNestApplication());
  await app.init();
  return app;
};
