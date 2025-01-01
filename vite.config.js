import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  server: {
    proxy: {
      '/bing-api': {
        target: 'https://cn.bing.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/bing-api/, '')
      }
    }
  }
}) 