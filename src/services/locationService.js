import axios from 'axios'
import { API_KEYS } from '../config/api'
import { welcomeMessages } from '../config/welcomeMessages'

const IP_LOCATION_API = 'https://myhkw.cn/open/ip'

export const locationService = {
  // 获取IP定位信息
  async getIpLocation() {
    try {
      const response = await axios.get(IP_LOCATION_API, {
        params: {
          key: API_KEYS.IP_LOCATION_KEY,
          type: 'json'  // 指定返回 JSON 格式
        }
      })

      console.log('IP定位响应:', response.data)

      if (response.data.code === 1 && response.data.msg === '获取成功') {
        const locationData = response.data.data
        return {
          city: locationData.city?.replace('市', '') || '',
          province: locationData.province || '',
          district: locationData.county || '',
          nation: locationData.country || '中国',
          ip: locationData.ip,
          area: locationData.area,
          isp: locationData.isp
        }
      }

      throw new Error('获取位置失败')
    } catch (error) {
      console.error('IP定位失败:', error)
      if (error.response?.data?.msg) {
        throw new Error(`定位失败: ${error.response.data.msg}`)
      }
      throw new Error('获取位置失败，请手动输入城市')
    }
  },

  // 获取欢迎语
  getWelcomeMessage(location) {
    let message = ''
    const { nation, province, city, isp } = location

    // 处理空值情况
    if (!city && !province) {
      return {
        greeting: this.getTimeGreeting(),
        message: '欢迎访问！'
      }
    }

    return {
      greeting: this.getTimeGreeting(city),  // 传入城市名称
      message: this.getLocationMessage(location)  // 分离位置欢迎语逻辑
    }
  },

  // 获取时间问候语
  getTimeGreeting(city = '') {
    const hour = new Date().getHours()
    const cityPrefix = city ? `${city}的朋友，` : ''
    
    if (hour >= 5 && hour < 11) return `🌤️ ${cityPrefix}早上好,一日之计在于晨`
    if (hour >= 11 && hour < 13) return `🌞 ${cityPrefix}中午好,记得午休喔~`
    if (hour >= 13 && hour < 17) return `🕞 ${cityPrefix}下午好,饮茶先啦！`
    if (hour >= 17 && hour < 19) return `🚶‍♂️ ${cityPrefix}即将下班,记得按时吃饭~`
    if (hour >= 19 && hour < 24) return `🌙 ${cityPrefix}晚上好,夜生活嗨起来！`
    return `🌙 ${cityPrefix}夜深了,早点休息,少熬夜`
  },

  // 获取位置欢迎语
  getLocationMessage(location) {
    const { nation, province, city, isp } = location
    
    // 处理国外访客
    if (nation !== '中国') {
      return welcomeMessages.countries[nation] || `带我去${nation}逛逛吧！`
    }

    // 处理中国访客
    const provinceName = (province || '').replace(/[省市]$/, '')
    const cityName = (city || '').replace('市', '')

    // 检查是否有特定城市的欢迎语
    if (welcomeMessages.cities[provinceName]?.[cityName]) {
      return welcomeMessages.cities[provinceName][cityName]
    }
    
    // 检查是否有城市默认欢迎语
    if (welcomeMessages.cities[provinceName]?.default) {
      return welcomeMessages.cities[provinceName].default
    }
    
    // 检查是否有省份欢迎语
    if (welcomeMessages.provinces[provinceName]) {
      return welcomeMessages.provinces[provinceName]
    }

    // 默认欢迎语
    return `欢迎来自${province}${city}的${isp}用户！`
  }
} 