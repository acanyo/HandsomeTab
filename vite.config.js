import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'

export default defineConfig({
  plugins: [vue()],
  server: {
    proxy: {
      '/api/linuxdo': {
        target: 'https://linux.do',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/linuxdo/, ''),
        headers: {
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
      },
      '/api/zhihu': {
        target: 'https://api.zhihu.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/zhihu/, '')
      },
      '/api/baidu': {
        target: 'https://top.baidu.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/baidu/, '')
      },
      '/api/juejin': {
        target: 'https://api.juejin.cn',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/juejin/, '')
      },
      '/api/tophub': {
        target: 'https://tophub.today',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/tophub/, '')
      }
    }
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
}) 