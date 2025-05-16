module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: 'tsconfig.json',
    tsconfigRootDir: __dirname,
    sourceType: 'module',
  },
  plugins: [
    '@typescript-eslint/eslint-plugin', // Plugin hỗ trợ TypeScript
    'prettier', // Tích hợp Prettier
    'unused-imports', // Loại bỏ import và biến không sử dụng
    'import', // Plugin cho sắp xếp import
  ],
  extends: [
    'eslint:recommended', // Quy tắc cơ bản từ ESLint
    'plugin:@typescript-eslint/recommended', // Quy tắc TypeScript
    'plugin:prettier/recommended', // Kết hợp Prettier với ESLint
    'prettier', // Sử dụng Prettier để ghi đè ESLint trong format
  ],
  root: true, // Đánh dấu đây là cấu hình gốc
  env: {
    node: true, // Cấu hình môi trường Node.js
    jest: true, // Cấu hình môi trường Jest
  },
  ignorePatterns: ['.eslintrc.js', 'src/main.ts', 'pnpm-lock.yaml'], // Bỏ qua linting cho .eslintrc.js và src/main.ts
  rules: {
    '@typescript-eslint/explicit-function-return-type': 'error', // Yêu cầu định nghĩa kiểu trả về hàm
    '@typescript-eslint/explicit-module-boundary-types': 'error', // Yêu cầu định nghĩa kiểu rõ ràng cho boundary module
    '@typescript-eslint/no-explicit-any': 'error', // Cấm sử dụng kiểu any

    // Quy tắc của Prettier
    'prettier/prettier': 'error', // Lỗi nếu mã không tuân theo định dạng Prettier

    // Quy tắc unused-imports
    'unused-imports/no-unused-imports': 'error', // Xóa import không cần thiết
    '@typescript-eslint/no-unused-vars': [
      'warn',
      {
        vars: 'all', // Kiểm tra tất cả các biến
        varsIgnorePattern: '^_', // Bỏ qua biến bắt đầu với '_'
        args: 'after-used', // Kiểm tra các tham số sau tham số được sử dụng cuối cùng
        argsIgnorePattern: '^_', // Bỏ qua tham số bắt đầu bằng '_'
        ignoreRestSiblings: true,
      },
    ],

    // Quy tắc kiểm soát console
    'no-console': [
      'warn',
      {
        allow: ['warn', 'error'], // Chỉ cho phép sử dụng console.warn và console.error
      },
    ],

    // Quy tắc cho kiểu tên interface
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

    // Quy tắc sắp xếp các import
    'import/order': [
      'error',
      {
        "warnOnUnassignedImports": true,
        'newlines-between': 'always', // Chèn một dòng trống giữa các nhóm import
        groups: [
          'builtin',
          'external',
          'internal', // Các module internal (file trong project)
          'index',
          'parent',
          'sibling', // Các module thuộc parent, sibling, hay index,
          ['type', 'object']

        ],
        pathGroups: [
          {
            pattern: '@nestjs/**', // Đảm bảo các module NestJS luôn được ưu tiên import trước
            group: 'builtin',
            position: 'before',
          },
          {
            pattern: '**/*.repository', // Đảm bảo các module NestJS luôn được ưu tiên import trước
            group: 'internal',
            position: 'before',
          }
        ],
        pathGroupsExcludedImportTypes: ['builtin'],
        alphabetize: {
          order: 'asc',
          caseInsensitive: true,
        },
      },
    ],

    // Các quy tắc khác
    semi: ['error', 'always'], // Bắt buộc có dấu chấm phẩy
  },
};
