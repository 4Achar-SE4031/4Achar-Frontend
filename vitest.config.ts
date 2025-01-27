import { defineConfig } from 'vitest/config'

export default defineConfig({
    // plugins: [react()],
    test: {
      setupFiles: "./vitest.setup.ts",
        globals: true,
        environment: 'jsdom',
    coverage: {
    //   provider: 'v8', // 'c8' is the default, but you can specify it explicitly
      reporter: ['text', 'html'], // You can choose the format of the coverage report (text, html, etc.)
      include: ['**/*.test.tsx'], // Files to include for coverage (usually your src folder)
      exclude: ['node_modules', 'tests'], // Files to exclude from coverage (usually node_modules and test files)
    },
  },
})