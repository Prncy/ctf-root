import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// GitHub Pages serves this project from /ctf-root/.
// Vite still serves the app from / during local development.
export default defineConfig({
  plugins: [react()],
  base: '/ctf-root/',
});
