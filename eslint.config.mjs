import { defineConfig, globalIgnores } from 'eslint/config';
import nextVitals from 'eslint-config-next/core-web-vitals';
import prettier from 'eslint-config-prettier/flat';
import nextTs from 'eslint-config-next/typescript';

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  prettier,
  globalIgnores([
    '.next/**',
    'out/**',
    'build/**',
    '__tests__/**',
    'node_modules/**',
    '.content-collections/**',
    '.github/**',
    '.swc/**',
    '.vscode/**',
    '.yarn/**',
    'coverage/**',
    'docs/**',
    'prisma/**',
    'public/**',
    'next-env.d.ts',
    'generated/**',
  ]),
  {
    settings: {
      // Fix for ESLint 10+: eslint-plugin-react uses context.getFilename() (legacy API)
      // which was removed in ESLint 10 flat config. Declaring the version explicitly
      // prevents the plugin from trying to auto-detect it and failing.
      react: { version: '19' },
    },
  },
]);

export default eslintConfig;
