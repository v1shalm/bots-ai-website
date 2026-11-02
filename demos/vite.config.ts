import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'node:path'

// Dev: `npm run dev` serves preview.html (?demo=<name>&w=<px>) for rehearsing one demo at its slot width.
// Build: one small loader (main.js) plus a lazy chunk per demo, written into the static site.
export default defineConfig(({ command }) => ({
  plugins: [react()],
  base: './',
  resolve: { dedupe: ['react', 'react-dom'] },
  server: { host: '127.0.0.1', fs: { allow: ['..'] } },
  build: command === 'build' ? {
    target: 'es2020',
    outDir: resolve(__dirname, '../scanline/assets/demos'),
    emptyOutDir: true,
    rollupOptions: {
      input: resolve(__dirname, 'src/main.tsx'),
      output: {
        entryFileNames: 'main.js',
        chunkFileNames: '[name]-[hash].js',
        assetFileNames: '[name]-[hash][extname]',
      },
    },
  } : {},
}))
