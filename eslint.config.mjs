import { FlatCompat } from '@eslint/eslintrc';

const compat = new FlatCompat({
  baseDirectory: import.meta.dirname,
});

const eslintConfig = [
  {
    ignores: [
      '__tests__/**',
      'node_modules/**',
      '.next/**',
      '.content-collections/**',
      '.github/**',
      '.swc/**',
      '.vscode/**',
      '.yarn/**',
      'coverage/**',
      'docs/**',
      'prisma/**',
      'public/**',
      'out/**',
      'build/**',
      'next-env.d.ts',
    ],
  },
  ...compat.config({
    extends: ['next/core-web-vitals', 'next/typescript', 'prettier'],
  }),
];

export default eslintConfig;
