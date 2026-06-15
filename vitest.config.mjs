import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['src/**/*.test.{ts,js}', 'packages/**/*.test.{ts,js}'],
    environment: 'node',
    environmentMatchGlobs: [
      ['src/utils/storage.test.ts', 'happy-dom'],
      ['src/utils/wizard-engine.test.ts', 'happy-dom'],
    ],
    globals: true,
  },
});
