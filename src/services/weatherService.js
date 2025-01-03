import axios from 'axios'

const WEATHER_API = 'https://api.lolimi.cn/API/weather'

export const weatherService = {
  async getWeather(city) {
    try {
      const response = await axios.get(WEATHER_API, {
        params: { 
          city,
          type: 'json'
        }
      })

      console.log('Weather API Response:', response.data)

      // 检查响应状态
      if (!response.data || response.data.code !== 1) {
        throw new Error(response.data?.text || '获取天气失败')
      }

      const weatherData = response.data.data
      const currentData = weatherData.current

      // 格式化返回的数据
      return {
        city: weatherData.city,
        temperature: `${currentData.temp || '--'}℃`,  // 使用实时温度
        weather: currentData.weather || '--',
        wind: currentData.wind || '--',
        windspeed: `${currentData.windSpeed || '--'}`,
        humidity: currentData.humidity || '--',
        air: currentData.air || '--',
        visibility: currentData.visibility || '--',
        time: currentData.time || '--'
      }
    } catch (error) {
      console.error('获取天气失败:', error)
      if (error.response?.data?.text) {
        throw new Error(error.response.data.text)
      }
      throw new Error('获取天气失败，请稍后重试')
    }
  }
} 