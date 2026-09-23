// E2E tests: boot the real AppModule against a throwaway Postgres container.
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  rootDir: '..',
  testRegex: 'test/.*\\.e2e-spec\\.ts$',
  setupFiles: ['<rootDir>/src/polyfills/node-compat.ts'],
  globalSetup: '<rootDir>/test/global-setup.ts',
  globalTeardown: '<rootDir>/test/global-teardown.ts',
  testTimeout: 60000,
  transform: {
    '^.+\\.ts$': ['ts-jest', { tsconfig: '<rootDir>/tsconfig.spec.json' }],
  },
};
