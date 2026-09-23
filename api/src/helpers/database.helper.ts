const LOCAL_DB_HOSTS = ['localhost', '127.0.0.1', '/var/run/postgresql'];

/**
 * TypeORM `ssl` option. `DB_SSL=true|false` wins; when unset, local hosts
 * connect without SSL and anything else uses SSL.
 */
export const resolveDbSsl = (
  env: NodeJS.ProcessEnv = process.env,
): false | { rejectUnauthorized: false } => {
  const flag = env.DB_SSL?.trim().toLowerCase();
  const useSsl =
    flag === 'true' ? true : flag === 'false' ? false : !LOCAL_DB_HOSTS.includes(env.DB_HOST || '');

  return useSsl ? { rejectUnauthorized: false } : false;
};
