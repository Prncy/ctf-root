import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// GitHub Pages hosts this repository under /ctf-root/.
// Keep the normal root path when running the app locally.
export default defineConfig({
  plugins: [react()],
  base: process.env.GITHUB_ACTIONS ? '/ctf-root/' : '/',
});
