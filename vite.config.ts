import { createHtmlPlugin } from 'vite-plugin-html';
import { defineConfig } from 'vite';
import eslint from 'vite-plugin-eslint';
import path from 'path';
import react from '@vitejs/plugin-react';
import svgr from 'vite-plugin-svgr';
import tsconfigPaths from 'vite-tsconfig-paths';

// https://vite.dev/config/
export default defineConfig({
  build: {
    outDir: './build',
    emptyOutDir: true,
  },
  plugins: [
    createHtmlPlugin({ minify: true, template: 'public/index.html' }),
    eslint(),
    react(),
    svgr(),
    tsconfigPaths()
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
