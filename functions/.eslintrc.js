module.exports = {
  env: {
    es6: true,
    node: true,
  },
  extends: ['heimdall/node'],
  ignorePatterns: [
    '/lib/**/*', // Ignore built files.
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: ['tsconfig.json', 'tsconfig.dev.json'],
    sourceType: 'module',
    tsconfigRootDir: __dirname,
  },
  root: true,
  rules: {
    'import/no-unresolved': 'off',
  },
};
