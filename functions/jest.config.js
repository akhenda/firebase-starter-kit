// basarat.gitbook.io/typescript/intro-1/jest#step-2-configure-jest
/* eslint-disable sort-keys-fix/sort-keys-fix */
const { pathsToModuleNameMapper } = require('ts-jest');

// In the following statement, replace `./tsconfig` with the path to your `tsconfig` file
// which contains the path mapping (ie the `compilerOptions.paths` option):
const { compilerOptions } = require('./tsconfig.json');

// /** @type {import('jest').Config} */
/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  rootDir: './',
  testMatch: ['<rootDir>/**/*.spec.ts'],
  setupFilesAfterEnv: ['jest-extended/all', '<rootDir>/__tests__/__utils__/setup-after-env.ts'],
  transform: {
    '^.+\\.[tj]sx?$': ['ts-jest', { tsconfig: '<rootDir>/__tests__/tsconfig.json' }],
  },
  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, { prefix: '<rootDir>/' }),
  verbose: true,
  collectCoverage: true,
  coverageReporters: ['json', 'html', 'text-summary', 'lcov'],
  coverageThreshold: {
    global: {
      lines: 60,
    },
  },
};
/* eslint-enable */
