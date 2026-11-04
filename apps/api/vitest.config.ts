import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    include: ['tests/**/*.test.ts'],
    env: {
      NODE_ENV: 'test',
      JWT_SECRET: 'test-jwt-secret-0123456789abcdef0123456789',
      JWT_REFRESH_SECRET: 'test-jwt-refresh-secret-0123456789abcdef',
    },
  },
})
