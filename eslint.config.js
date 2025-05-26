import eslint from '@eslint/js';
import {configs as tseslintConfigs} from 'typescript-eslint';

const {configs: eslintConfigs} = eslint;

export default [
  {
    files: [
      'src/**/*.ts'
    ]
  },
  eslintConfigs.recommended,
  ...tseslintConfigs.recommended,
  {
    rules: {
      '@typescript-eslint/no-unused-vars': 'off'
    }
  }
];
