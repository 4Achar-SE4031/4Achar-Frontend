import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'


// https://vite.dev/config/
export default defineConfig({
  server: {
    host: true,
    port: 3000
  },
  plugins: [react()],
  test: { 
    globals: true,
    environment: 'jsdom',
    setupFiles: './setup.ts',
    testTimeout: 10000, 
    coverage: {
      provider: 'v8', // or 'c8' if you prefer
      reporter: ['text', 'json', 'html'], // coverage report formats
      include: ['src/**/*.{tsx}'], // files to include for coverage
      exclude: ['**/*.d.ts','src/**/*.{ts}', 'node_modules/', 'src/**/*.test.{ts,tsx}', 'src/app/models/**'], // files to exclude
      all: true, // include all files, not just covered ones
      // Optionally, you can set thresholds to enforce minimum coverage
      // thresholds: {
      //   global: {
      //     branches: 80,
      //     functions: 80,
      //     lines: 80,
      //     statements: 80,
      //   },
      // },
    },
  },
  build: {
    // This will handle large font files or other assets
    assetsInlineLimit: 0, // Ensure all assets are copied instead of inlined
    chunkSizeWarningLimit: 2500, // Increase the chunk size warning limit to 1 MB (1000 KB)
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'lottie-web'], // Example of manual chunking
        },
      },
    },
  },
  base: "/",
})
