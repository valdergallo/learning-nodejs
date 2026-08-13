import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: false,
    environment: 'node',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'lcov'],
      include: ['src/**'],
      reportsDirectory: 'coverage',
      // Coverage thresholds are enforced in CI via script or vitest CLI options if needed.
    },
  },
});
