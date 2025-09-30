import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  base: './', // Use relative paths for Electron
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
  }
})
