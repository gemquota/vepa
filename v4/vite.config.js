import { defineConfig } from 'vite';

export default defineConfig({
  // Vercel builds serve at the root; GitHub Pages at /vepa/vepar/
  base: process.env.VERCEL === '1' ? '/' : '/vepa/vepar/',
  root: '.',
  build: {
    outDir: '.dist',
    crossorigin: false,
    rollupOptions: {
      input: './index.html',
    },
  },
  server: {
    headers: {
      'Cross-Origin-Opener-Policy': 'same-origin',
      'Cross-Origin-Embedder-Policy': 'require-corp',
    },
    host: true,
  },
  worker: {
    format: 'es',
  },
});
