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
    environment: 'jsdom',
    browser: {
      provider: playwright(),
      enabled: true,
      // at least one instance is required
      instances: [
        { browser: 'chromium' },
      ],
    },
    globals: true,
    include: ['src/**/*.test.{ts,tsx}'],
    setupFiles: ['./test/setup.ts'],
  },
})
