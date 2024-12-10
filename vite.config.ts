import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  server: {
    port: 3000
  },
  plugins: [react()],
  test: { 
    globals: true,
    environment: 'jsdom',
    setupFiles: './setup.ts',
  },
})
