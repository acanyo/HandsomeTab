import { defineStore } from 'pinia'
import { backgroundService } from '../services/backgroundService'

export const useSettingsStore = defineStore('settings', {
  state: () => ({
    background: 'https://bing.com/th?id=OHR.JinliStreet_ZH-CN3020276206_UHD.jpg&rf=LaDigue_UHD.jpg&pid=hp&w=3840&h=2160&rs=1&c=4',
    backgroundMode: 'daily',
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
    async setBackground(url, preload = true) {
      if (!url) return

      try {
        this.backgroundLoading = true
        this.backgroundError = null
        
        if (preload) {
          await backgroundService.preloadImage(url)
        }
        
        this.background = url
        localStorage.setItem('background', url)
      } catch (error) {
        this.backgroundError = '背景图片加载失败'
        console.error('设置背景失败:', error)
        this.background = 'https://www4.bing.com/th?id=OHR.PolarBearSwim_ZH-CN1000349057_1920x1080.jpg'
      } finally {
        this.backgroundLoading = false
      }
    },

    async fetchDailyBackground() {
      try {
        const url = await backgroundService.getBingDaily()
        if (url) {
          await this.setBackground(url)
        }
      } catch (error) {
        console.error('获取每日背景失败:', error)
        await this.setBackground('https://www4.bing.com/th?id=OHR.PolarBearSwim_ZH-CN1000349057_1920x1080.jpg')
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
    },
    
    async loadSettings() {
      const background = localStorage.getItem('background')
      const backgroundMode = localStorage.getItem('backgroundMode')
      const searchEngine = localStorage.getItem('searchEngine')
      const theme = localStorage.getItem('theme')
      
      if (background) this.background = background
      if (searchEngine) this.searchEngine = searchEngine
      if (theme) this.theme = JSON.parse(theme)

      if (backgroundMode) {
        this.backgroundMode = backgroundMode
      }
      
      // 如果没有背景或者是每日模式，获取最新壁纸
      if (!background || this.backgroundMode === 'daily') {
        await this.fetchDailyBackground()
      } else {
        this.background = background
      }
    }
  }
}) 