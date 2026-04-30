import js from '@eslint/js';
import globals from 'globals';
import jestPlugin from 'eslint-plugin-jest';

export default [
  {
    ignores: ['dist/**']
  },
  js.configs.recommended,
  {
    files: ['**/*.js'],
    plugins: {
      jest: jestPlugin
    },
    languageOptions: {
      ecmaVersion: 2021,
      sourceType: 'module',
      globals: {
        ...globals.node,
        ...globals.jest
      }
    },
    rules: {
      'linebreak-style': ['error', 'unix'],
      quotes: ['error', 'single'],
      semi: ['error', 'always']
    }
  }
];
