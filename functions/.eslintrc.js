module.exports = {
  env: {
    es6: true,
    node: true,
  },
  extends: ['heimdall/node', 'heimdall/tests'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: ['tsconfig.json', 'tsconfig.dev.json', './__tests__/tsconfig.json'],
    sourceType: 'module',
    tsconfigRootDir: __dirname,
  },
  plugins: ['jest-extended'],
  root: true,
  rules: {
    'import/no-extraneous-dependencies': ['error', { devDependencies: true }],

    'import/no-unresolved': 'off',

    'jest-extended/prefer-to-be-false': 'error',
    'jest-extended/prefer-to-be-true': 'warn',

    'sort-class-members/sort-class-members': [
      2,
      {
        accessorPairPositioning: 'getThenSet',
        order: [
          '[static-properties]',
          '[static-methods]',
          '[properties]',
          'constructor',
          '[conventional-private-properties]',
          '[methods]',
          '[conventional-private-methods]',
        ],
      },
    ],
  },
};
