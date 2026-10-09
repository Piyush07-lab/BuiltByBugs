import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

const frontendRoot = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  root: frontendRoot,
  plugins: [react()],
  test: {
    globals: true,
    environment: 'happy-dom',
    setupFiles: [path.resolve(frontendRoot, 'test/setup.js')],
    include: ['test/**/*.{test,spec}.{js,jsx,mjs}'],
    coverage: {
      reporter: ['text', 'json', 'html'],
    },
  },
});
