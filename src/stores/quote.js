import { defineStore } from 'pinia'
import axios from 'axios'

export const useQuoteStore = defineStore('quote', {
  state: () => ({
    quote: null,
    lastFetchDate: null
  }),

  actions: {
    async fetchDailyQuote() {
      const today = new Date().toDateString()
      
      // 如果今天已经获取过，直接返回缓存的数据
      if (this.lastFetchDate === today && this.quote) {
        return this.quote
      }

      try {
        // 这里使用一言API
        const response = await axios.get('https://v1.hitokoto.cn')
        this.quote = {
          content: response.data.hitokoto,
          author: response.data.from_who || '佚名'
        }
        this.lastFetchDate = today
        
        // 保存到本地存储
        localStorage.setItem('dailyQuote', JSON.stringify({
          quote: this.quote,
          date: today
        }))
      } catch (error) {
        console.error('获取每日一句失败:', error)
      }
    },

    loadFromStorage() {
      const saved = localStorage.getItem('dailyQuote')
      if (saved) {
        const { quote, date } = JSON.parse(saved)
        const today = new Date().toDateString()
        
        if (date === today) {
          this.quote = quote
          this.lastFetchDate = date
        } else {
          this.fetchDailyQuote()
        }
      }
    }
  }
}) 