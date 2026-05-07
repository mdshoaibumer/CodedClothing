/**
 * Vite Configuration — Coded Clothing
 * 
 * Build Optimizations:
 * - Manual chunk splitting for optimal caching (animations, React)
 * - CSS code splitting enabled
 * - Minification via esbuild (fastest)
 * - Target modern browsers for smaller bundle output
 */

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath } from 'url'
import path from 'path'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    /* Target modern browsers for smaller output (no legacy polyfills) */
    target: 'es2020',
    /* Enable CSS code splitting for parallel loading */
    cssCodeSplit: true,
    /* Source maps off in production for security */
    sourcemap: false,
    /* Chunk size warning at 300KB */
    chunkSizeWarningLimit: 300,
    rollupOptions: {
      output: {
        /**
         * Manual chunk splitting strategy:
         * - animation-vendor: Framer Motion (~100KB) — shared across pages
         * - react-vendor: React DOM + Router (~150KB) — rarely changes
         * - state-vendor: Zustand — rarely changes
         * - scroll-vendor: Lenis smooth scroll — rarely changes
         */
        manualChunks(id) {
          if (id.includes('framer-motion')) {
            return 'animation-vendor';
          }
          if (id.includes('react-dom') || id.includes('react-router')) {
            return 'react-vendor';
          }
          if (id.includes('zustand')) {
            return 'state-vendor';
          }
          if (id.includes('lenis')) {
            return 'scroll-vendor';
          }
        },
      },
    },
  },
})
