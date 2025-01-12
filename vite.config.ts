import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  define: {
    __dirname: JSON.stringify(path.resolve()), // Support for `__dirname`
  },
  build: {
    sourcemap: true, // Optional for debugging
  },
});
