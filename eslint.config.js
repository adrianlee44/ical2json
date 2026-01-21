import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';

export default [
  {
    ignores: ['node_modules/', 'build/'],
  },
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  eslintPluginPrettierRecommended,
  {
    files: ['src/**/*.ts', 'test/**/*.ts'],
    rules: {
      'no-trailing-spaces': 'error',
    },
  },
];
