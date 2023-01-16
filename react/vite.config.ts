import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import pluginRewriteAll from 'vite-plugin-rewrite-all';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), pluginRewriteAll()],
  build: {
    rollupOptions: {
      output: {
        entryFileNames: 'index.js',
        assetFileNames: 'index.scss',
        chunkFileNames: "chunk.js",
        manualChunks: undefined,
      }
    }
  },
  server: {
    fs: {
      strict: false
    }
  }
})
