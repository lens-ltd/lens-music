import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { DataSource } from 'typeorm';
import { seedPermissions } from '../src/seeds/permission.seeds';
import { seedUsers } from '../src/seeds/user.seeds';
import { seedRoles } from '../src/seeds/role.seeds';
import { createTestApp } from './utils/create-test-app';

describe('Auth (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    app = await createTestApp();

    // Registration needs the GENERAL_USER role, which the role seed creates.
    const dataSource = app.get(DataSource);
    for (const seed of [seedPermissions, seedUsers, seedRoles]) {
      await seed(dataSource);
    }
  });

  afterAll(async () => {
    await app?.close();
  });

  it('registers, logs in and reads releases with the token', async () => {
    const credentials = { email: 'Artist@Example.com', password: 'Str0ng!Passw0rd' };

    await request(app.getHttpServer())
      .post('/api/auth/register')
      .send({ ...credentials, name: 'Test artist' })
      .expect(200);

    const login = await request(app.getHttpServer())
      .post('/api/auth/login')
      .send(credentials)
      .expect(200);

    const { accessToken, user } = login.body.data;
    expect(accessToken).toEqual(expect.any(String));
    expect(user.email).toBe('artist@example.com');
    expect(user).not.toHaveProperty('password');

    const releases = await request(app.getHttpServer())
      .get('/api/releases')
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200);

    expect(releases.body.data).toBeDefined();
  });

  it('refuses to register the same email twice', async () => {
    const res = await request(app.getHttpServer())
      .post('/api/auth/register')
      .send({ email: 'artist@example.com', password: 'Str0ng!Passw0rd', name: 'Again' });

    expect(res.status).toBeGreaterThanOrEqual(400);
    expect(res.status).toBeLessThan(500);
  });

  it('rejects a phone number that cannot be dialed', async () => {
    const res = await request(app.getHttpServer())
      .post('/api/auth/register')
      .send({
        email: 'bad-phone@example.com',
        password: 'Str0ng!Passw0rd',
        name: 'Bad phone',
        phoneNumber: '0788',
      });

    expect(res.status).toBe(400);
  });

  it('stores a phone number in E.164', async () => {
    const res = await request(app.getHttpServer())
      .post('/api/auth/register')
      .send({
        email: 'phone@example.com',
        password: 'Str0ng!Passw0rd',
        name: 'Phone owner',
        phoneNumber: '+250 788 123 456',
      })
      .expect(200);

    expect(res.body.data.user.phoneNumber).toBe('+250788123456');
  });
});
