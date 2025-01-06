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
        rewrite: (path) => path.replace(/^\/api\/linuxdo/, '')
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
      '/api/hotday': {
        target: 'https://www.hotday.uk',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/hotday/, '')
      }
    }
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
}) 