import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import svgr from 'vite-plugin-svgr';
import tsconfigPaths from 'vite-tsconfig-paths';

// https://vite.dev/config/
export default defineConfig({
  build: {
    outDir: './build',
    emptyOutDir: true,
  },
  plugins: [react(), svgr(), tsconfigPaths()],
});
