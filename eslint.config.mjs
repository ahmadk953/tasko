import typescriptEslint from '@typescript-eslint/eslint-plugin';
import reactCompiler from 'eslint-plugin-react-compiler';
import tsParser from '@typescript-eslint/parser';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import js from '@eslint/js';
import { FlatCompat } from '@eslint/eslintrc';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
});

export default [
  ...compat.extends('next/core-web-vitals', 'prettier'),
  {
    plugins: {
      '@typescript-eslint': typescriptEslint,
      'react-compiler': reactCompiler,
    },

    rules: {
      '@next/next/no-duplicate-head': 'off', // Turn off this rule for now as it's giving false positives
    },

    files: ['**/*.ts', '**/*.tsx'],

    languageOptions: {
      ecmaVersion: 5,
      sourceType: 'script',

      parser: tsParser,
      parserOptions: {
        project: './tsconfig.json',
      },
    },
  },
];
