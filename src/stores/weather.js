import { defineStore } from 'pinia'
import axios from 'axios'

export const useWeatherStore = defineStore('weather', {
  state: () => ({
    weather: null,
    weatherDetail: null,
    location: null
  }),

  actions: {
    async getLocation() {
      try {
        const position = await new Promise((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject)
        })
        
        this.location = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        }
        
        localStorage.setItem('location', JSON.stringify(this.location))
      } catch (error) {
        console.error('获取位置失败:', error)
      }
    },

    async fetchWeather() {
      try {
        if (!this.location) {
          await this.getLocation()
        }

        // 这里使用和风天气API，需要自己申请key
        const { data } = await axios.get('https://api.qweather.com/v7/weather/now', {
          params: {
            key: 'your-api-key',
            location: `${this.location.longitude},${this.location.latitude}`
          }
        })

        this.weather = {
          temp: data.now.temp,
          text: data.now.text,
          icon: data.now.icon,
          city: '获取中...' // 需要通过逆地理编码API获取
        }

        // 获取详细天气信息
        await this.fetchWeatherDetail()
      } catch (error) {
        console.error('获取天气失败:', error)
      }
    },

    async fetchWeatherDetail() {
      try {
        const [forecast, life] = await Promise.all([
          axios.get('https://api.qweather.com/v7/weather/3d'),
          axios.get('https://api.qweather.com/v7/indices/1d')
        ])

        this.weatherDetail = {
          forecast: forecast.data.daily,
          lifeIndex: life.data.daily
        }
      } catch (error) {
        console.error('获取天气详情失败:', error)
      }
    }
  }
}) 