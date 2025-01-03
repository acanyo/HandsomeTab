import { defineStore } from 'pinia'
import { backgroundService } from '../services/backgroundService'

export const useSettingsStore = defineStore('settings', {
  state: () => ({
    background: null,
    backgroundLoading: false,
    backgroundError: null,
    autoChangeBackground: true,
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
        autoChangeBackground: this.autoChangeBackground,
        // ... 其他需要保存的设置
      }
      localStorage.setItem('settings', JSON.stringify(settings))
    },

    loadSettings() {
      try {
        const settings = JSON.parse(localStorage.getItem('settings'))
        if (settings) {
          this.background = settings.background
          this.autoChangeBackground = settings.autoChangeBackground ?? true
          // ... 加载其他设置
        }
        
        // 如果开启了自动更换且没有背景，获取必应壁纸
        if (this.autoChangeBackground && !this.background) {
          this.fetchDailyBackground()
        }
      } catch (error) {
        console.error('加载设置失败:', error)
      }
    },

    async setBackground(url, preload = true) {
      if (!url) return

      try {
        this.backgroundLoading = true
        this.backgroundError = null
        
        if (preload) {
          await backgroundService.preloadImage(url)
        }
        
        this.background = url
        this.saveSettings() // 保存设置
      } catch (error) {
        this.backgroundError = '背景图片加载失败'
        console.error('设置背景失败:', error)
      } finally {
        this.backgroundLoading = false
      }
    },

    setAutoChange(value) {
      this.autoChangeBackground = value
      this.saveSettings() // 保存设置
    },

    async resetBackground() {
      this.background = null
      this.autoChangeBackground = true
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