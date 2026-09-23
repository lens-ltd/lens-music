import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { createTestApp } from './utils/create-test-app';

describe('App (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    app = await createTestApp();
  });

  afterAll(async () => {
    await app?.close();
  });

  it('serves routes under the /api prefix', async () => {
    await request(app.getHttpServer()).get('/auth/login').expect(404);
  });

  it('rejects an invalid login body with 400', async () => {
    await request(app.getHttpServer())
      .post('/api/auth/login')
      .send({ email: 'not-an-email' })
      .expect(400);
  });

  it('rejects unknown credentials without leaking a 500', async () => {
    const res = await request(app.getHttpServer())
      .post('/api/auth/login')
      .send({ email: 'nobody@lens.test', password: 'wrong-password' });

    expect(res.status).toBeGreaterThanOrEqual(400);
    expect(res.status).toBeLessThan(500);
  });

  it('requires a token on protected routes', async () => {
    await request(app.getHttpServer()).get('/api/releases').expect(401);
  });
});
