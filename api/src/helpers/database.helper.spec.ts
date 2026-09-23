import { resolveDbSsl } from './database.helper';

describe('resolveDbSsl', () => {
  it('disables SSL for local hosts by default', () => {
    expect(resolveDbSsl({ DB_HOST: 'localhost' })).toBe(false);
  });

  it('enables SSL for remote hosts by default', () => {
    expect(resolveDbSsl({ DB_HOST: 'db.example.com' })).toEqual({ rejectUnauthorized: false });
  });

  it('lets DB_SSL override the host rule', () => {
    expect(resolveDbSsl({ DB_HOST: '172.17.0.2', DB_SSL: 'false' })).toBe(false);
    expect(resolveDbSsl({ DB_HOST: 'localhost', DB_SSL: 'TRUE' })).toEqual({ rejectUnauthorized: false });
  });
});
