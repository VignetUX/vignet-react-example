import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import { fileURLToPath } from 'url'
import { playwright } from '@vitest/browser-playwright'

export default defineConfig({
  plugins: [react()],
  // This alias intentionally lives only here, not in vite.config.ts — it mirrors consumer
  // projects (e.g. Next.js apps) that define aliases via vitest.config.ts / tsconfig paths
  // but have no vite.config.ts at all.
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  test: {
    globals: true,
    include: ['src/**/*.test.{ts,tsx}'],
    setupFiles: ['./test/setup.ts'],
    projects: [
      {
        extends: true,
        test: {
          name: 'jsdom',
          environment: 'jsdom',
        },
      },
      {
        extends: true,
        test: {
          name: 'browser-workspace',
          browser: {
            provider: playwright(),
            enabled: true,
            instances: [
              { browser: 'chromium', name: 'browser' },
            ],
          },
        },
      },
    ],
  },
})
