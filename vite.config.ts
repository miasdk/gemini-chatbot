import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './client'),
      '@/components': path.resolve(__dirname, './client/components'),
      '@/hooks': path.resolve(__dirname, './client/hooks'),
      '@/types': path.resolve(__dirname, './client/types'),
      '@/utils': path.resolve(__dirname, './client/utils'),
    },
  },
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
      },
    },
  },
  build: {
    outDir: '../dist',
    assetsDir: 'assets',
    rollupOptions: {
      input: path.resolve(__dirname, 'client/index.html'),
    },
    emptyOutDir: true,
  },
  root: 'client',
});