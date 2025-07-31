import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import * as path from 'path'
import { fileURLToPath, URL } from 'node:url'
import type { Plugin } from 'vite'

const reactPlugin = react()

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react() as Plugin[]],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  server: {
    port: 5173,
    host: true,
    strictPort: true,
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
  },
})
