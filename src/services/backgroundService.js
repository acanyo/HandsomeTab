import axios from 'axios'

// 必应官方API
const BING_API = '/bing-api/HPImageArchive.aspx'
const BING_BASE = 'https://cn.bing.com'

export const backgroundService = {
  // 获取必应每日图片
  async getBingDaily() {
    try {
      const response = await axios.get(BING_API, {
        params: {
          format: 'js',
          idx: 0,
          n: 1,
          pid: 'hp',
          uhd: 1,
          uhdwidth: 3840,
          uhdheight: 2160
        }
      })
      
      const image = response.data.images[0]
      return BING_BASE + image.url
    } catch (error) {
      console.error('获取必应壁纸失败:', error)
      return 'https://bing.com/th?id=OHR.JinliStreet_ZH-CN3020276206_UHD.jpg&rf=LaDigue_UHD.jpg&pid=hp&w=3840&h=2160&rs=1&c=4'
    }
  },

  // 获取历史壁纸列表
  async getBingArchive() {
    try {
      const response = await axios.get(BING_API, {
        params: {
          format: 'js',
          idx: 0,
          n: 8,
          pid: 'hp',
          uhd: 1,
          uhdwidth: 3840,
          uhdheight: 2160
        }
      })
      
      return response.data.images.map(image => ({
        url: BING_BASE + image.url,
        copyright: image.copyright,
        title: image.title,
        date: image.startdate
      }))
    } catch (error) {
      console.error('获取壁纸历史失败:', error)
      return []
    }
  },

  // 预加载图片
  preloadImage(url) {
    return new Promise((resolve, reject) => {
      const img = new Image()
      img.onload = () => resolve(url)
      img.onerror = () => reject(new Error('图片加载失败'))
      img.src = url
    })
  },

  // 随机获取一张历史壁纸
  async getRandomBackground() {
    try {
      const archives = await this.getBingArchive()
      if (archives.length > 0) {
        const randomIndex = Math.floor(Math.random() * archives.length)
        return archives[randomIndex].url
      }
      return await this.getBingDaily()
    } catch (error) {
      console.error('获取随机壁纸失败:', error)
      return 'https://bing.com/th?id=OHR.JinliStreet_ZH-CN3020276206_UHD.jpg&rf=LaDigue_UHD.jpg&pid=hp&w=3840&h=2160&rs=1&c=4'
    }
  }
} 