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
    // 如果是视频，直接返回
    if (url.endsWith('.mp4')) {
      return Promise.resolve(url)
    }

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

// 从本地存储获取链接配置
export const getLinks = () => {
  const links = localStorage.getItem('quickLinks')
  return links ? JSON.parse(links) : null
}

// 保存链接配置到本地存储
export const saveLinks = (links) => {
  localStorage.setItem('quickLinks', JSON.stringify(links))
}

// 添加新链接
export const addLink = (groupTitle, link) => {
  const links = getLinks()
  const group = links.find(g => g.title === groupTitle)
  if (group) {
    group.links.push(link)
    saveLinks(links)
  }
  return links
}

// 删除链接
export const removeLink = (groupTitle, url) => {
  const links = getLinks()
  const group = links.find(g => g.title === groupTitle)
  if (group) {
    group.links = group.links.filter(link => link.url !== url)
    saveLinks(links)
  }
  return links
}

// 添加新分组
export const addGroup = (groupTitle) => {
  const links = getLinks()
  links.push({
    title: groupTitle,
    links: []
  })
  saveLinks(links)
  return links
}

// 删除分组
export const removeGroup = (groupTitle) => {
  const links = getLinks()
  const newLinks = links.filter(group => group.title !== groupTitle)
  saveLinks(newLinks)
  return newLinks
}

// 更新链接信息
export const updateLink = (groupTitle, oldUrl, newLink) => {
  const links = getLinks()
  const group = links.find(g => g.title === groupTitle)
  if (group) {
    const linkIndex = group.links.findIndex(link => link.url === oldUrl)
    if (linkIndex !== -1) {
      group.links[linkIndex] = newLink
      saveLinks(links)
    }
  }
  return links
}

// 重置为默认配置
export const resetToDefault = () => {
  const { defaultLinks } = require('../config/links')
  saveLinks(defaultLinks)
  return defaultLinks
} 