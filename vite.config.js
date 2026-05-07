/**
 * Vite Configuration — Coded Clothing
 * 
 * Build Optimizations:
 * - Manual chunk splitting for optimal caching (Three.js, animations, React)
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
    rollupOptions: {
      output: {
        /**
         * Manual chunk splitting strategy:
         * - three-vendor: Three.js + React Three Fiber (~500KB) — cached separately
         * - animation-vendor: Framer Motion + GSAP (~200KB) — shared across pages
         * - react-vendor: React DOM + Router (~150KB) — rarely changes
         */
        manualChunks(id) {
          if (id.includes('three') || id.includes('@react-three')) {
            return 'three-vendor';
          }
          if (id.includes('framer-motion') || id.includes('gsap')) {
            return 'animation-vendor';
          }
          if (id.includes('react-dom') || id.includes('react-router')) {
            return 'react-vendor';
          }
        },
      },
    },
  },
})
