import { defineConfig } from 'oxlint';

export default defineConfig({
  categories: {
    correctness: 'error',
    suspicious: 'warn',
  },
  env: {
    browser: true,
  },
  plugins: ['react', 'typescript'],
  rules: {
    'react/react-in-jsx-scope': 'off',
  },
});
