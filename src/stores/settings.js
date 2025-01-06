import { defineStore } from 'pinia'
import { backgroundService } from '../services/backgroundService'

export const useSettingsStore = defineStore('settings', {
  state: () => ({
    background: null,
    backgroundPoster: null,
    backgroundLoading: false,
    backgroundError: null,
    searchEngine: 'google',
    showWeather: true,
    theme: {
      blur: 8,
      opacity: 0.2,
      mode: 'auto'
    }
  }),
  
  actions: {
    saveSettings() {
      const settings = {
        background: this.background,
        backgroundPoster: this.backgroundPoster,
        // ... 其他需要保存的设置
      }
      localStorage.setItem('settings', JSON.stringify(settings))
    },

    loadSettings() {
      try {
        const settings = JSON.parse(localStorage.getItem('settings'))
        if (settings) {
          this.background = settings.background
          this.backgroundPoster = settings.backgroundPoster
          // ... 加载其他设置
        }
        
        // 如果没有背景,获取必应壁纸
        if (!this.background) {
          this.fetchDailyBackground()
        }
      } catch (error) {
        console.error('加载设置失败:', error)
      }
    },

    async setBackground(url, poster = null, preload = true) {
      if (!url) return

      try {
        this.backgroundLoading = true
        this.backgroundError = null
        
        // 只对图片URL进行预加载
        if (preload && !url.endsWith('.mp4')) {
          await backgroundService.preloadImage(url)
        }
        
        this.background = url
        this.backgroundPoster = poster
        this.saveSettings() // 保存设置
      } catch (error) {
        this.backgroundError = '背景加载失败'
        console.error('设置背景失败:', error)
      } finally {
        this.backgroundLoading = false
      }
    },

    async resetBackground() {
      this.background = null
      this.saveSettings()
      await this.fetchDailyBackground()
    },

    async fetchDailyBackground() {
      try {
        const url = await backgroundService.getBingDaily()
        if (url) {
          await this.setBackground(url)
        }
      } catch (error) {
        console.error('获取每日背景失败:', error)
      }
    },
    
    setSearchEngine(engine) {
      this.searchEngine = engine
      localStorage.setItem('searchEngine', engine)
    },
    
    setTheme(theme) {
      this.theme = { ...this.theme, ...theme }
      localStorage.setItem('theme', JSON.stringify(this.theme))
      
      // 更新 CSS 变量
      document.documentElement.style.setProperty('--blur-amount', `${this.theme.blur}px`)
      document.documentElement.style.setProperty('--overlay-opacity', this.theme.opacity)
    }
  }
}) 