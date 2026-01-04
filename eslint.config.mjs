import nextCoreWebVitals from 'eslint-config-next/core-web-vitals';
import prettier from 'eslint-config-prettier/flat';

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
      'generated/**',
    ],
  },
  ...nextCoreWebVitals,
  prettier,
];

export default eslintConfig;
