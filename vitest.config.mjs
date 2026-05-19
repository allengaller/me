import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['src/**/*.test.{ts,js}', 'packages/**/*.test.{ts,js}'],
    environment: 'node',
    globals: true,
  },
});
