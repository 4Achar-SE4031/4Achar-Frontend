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
})
