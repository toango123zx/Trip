import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import tseslint from 'typescript-eslint';
import prettier from 'eslint-plugin-prettier';
import importPlugin from 'eslint-plugin-import';
import unusedImports from 'eslint-plugin-unused-imports';

// Tạo __dirname cho ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default tseslint.config(
  {
    // Thay thế cho .eslintignore
    ignores: [
      'dist/**',
      'node_modules/**',
      '.eslintrc.js',
      'vite.config.ts',
      'tailwind.config.js'
    ]
  },
  {
    extends: [
      js.configs.recommended,
      ...tseslint.configs.recommended,
    ],
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: {
        ...globals.browser,
        ...globals.node
      },
      parser: tseslint.parser,
      parserOptions: {
        project: resolve(__dirname, './tsconfig.app.json'),
        tsconfigRootDir: __dirname,
        sourceType: 'module',
      },
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
      '@typescript-eslint': tseslint.plugin,
      'prettier': prettier,
      'unused-imports': unusedImports,
      'import': importPlugin,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],

      // TypeScript rules
      '@typescript-eslint/explicit-function-return-type': 'error',
      '@typescript-eslint/explicit-module-boundary-types': 'error',
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/no-unused-vars': [
        'warn',
        {
          vars: 'all',
          varsIgnorePattern: '^_',
          args: 'after-used',
          argsIgnorePattern: '^_',
          ignoreRestSiblings: true,
        },
      ],
      '@typescript-eslint/naming-convention': [
        'error',
        {
          selector: 'interface',
          format: ['PascalCase'],
          custom: {
            regex: '^I[A-Z]',
            match: true,
          },
        },
      ],

      // Prettier rules
      'prettier/prettier': 'error',

      // Unused imports
      'unused-imports/no-unused-imports': 'error',

      // Console restriction
      'no-console': ['warn', { allow: ['warn', 'error'] }],

      // Import ordering - Simplified for better compatibility
      'import/order': [
        'warn', // Changed from 'error' to 'warn' to be less strict
        {
          'groups': [
            'builtin',
            'external',
            'internal',
            ['parent', 'sibling'],
            'index',
            'object',
            'type'
          ],
          'pathGroups': [
            {
              'pattern': 'react',
              'group': 'external',
              'position': 'before'
            },
            {
              'pattern': '@/**',
              'group': 'internal'
            },
            {
              'pattern': '*.css',
              'group': 'index',
              'patternOptions': { 'matchBase': true }
            }
          ],
          'newlines-between': 'always',
          'alphabetize': {
            'order': 'asc',
            'caseInsensitive': true
          }
        }
      ],

      // Other rules
      'semi': ['error', 'always'],
    },
    settings: {
      'import/parsers': {
        '@typescript-eslint/parser': ['.ts', '.tsx']
      },
      'import/resolver': {
        typescript: {
          alwaysTryTypes: true,
          project: resolve(__dirname, './tsconfig.app.json')
        },
        node: {
          extensions: ['.ts', '.tsx', '.js', '.jsx']
        },
        alias: {
          map: [
            ['@', './src']
          ],
          extensions: ['.ts', '.tsx', '.js', '.jsx', '.json'],
        }
      }
    }
  }
);