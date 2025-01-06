// 热搜服务

// XML Feed URL
const FEED_URL = '/api/hotday/feed'

export const hotSearchService = {
  // 解析XML数据
  parseXML(xmlText) {
    const parser = new DOMParser()
    const xmlDoc = parser.parseFromString(xmlText, 'text/xml')
    return xmlDoc
  },

  // 从XML中提取数据
  extractItems(xmlDoc) {
    const items = xmlDoc.getElementsByTagName('item')
    return Array.from(items).map(item => {
      const title = item.getElementsByTagName('title')[0]?.textContent || ''
      const link = item.getElementsByTagName('link')[0]?.textContent || ''
      const pubDate = item.getElementsByTagName('pubDate')[0]?.textContent || ''
      
      return {
        title,
        url: link,
        date: new Date(pubDate)
      }
    })
  },

  // 按来源分类数据
  categorizeItems(items) {
    const categorized = {
      linuxdo: [],
      zhihu: [],
      juejin: [],
      baidu: [],
      douyin: []
    }

    items.forEach(item => {
      // 根据URL判断来源
      if (item.url.includes('linux.do')) {
        categorized.linuxdo.push(item)
      } else if (item.url.includes('zhihu.com')) {
        categorized.zhihu.push(item)
      } else if (item.url.includes('juejin.cn')) {
        categorized.juejin.push(item)
      } else if (item.url.includes('baidu.com')) {
        categorized.baidu.push(item)
      } else if (item.url.includes('douyin.com')) {
        categorized.douyin.push(item)
      }
    })

    return categorized
  },

  // 获取热搜数据
  async getHotSearch() {
    try {
      // 获取XML feed数据
      const response = await fetch(FEED_URL, {
        headers: {
          'Accept': 'application/xml, text/xml, */*'
        }
      })
      
      if (!response.ok) {
        throw new Error(`获取Feed数据失败: ${response.status}`)
      }

      const xmlText = await response.text()
      const xmlDoc = this.parseXML(xmlText)
      const items = this.extractItems(xmlDoc)
      
      // 按时间排序，最新的在前
      items.sort((a, b) => b.date - a.date)
      
      // 分类数据
      const categorizedData = this.categorizeItems(items)

      // 限制每个分类的数量
      Object.keys(categorizedData).forEach(key => {
        categorizedData[key] = categorizedData[key].slice(0, 30)
      })

      return categorizedData
    } catch (error) {
      console.error('获取热搜数据失败:', error)
      // 返回空数据而不是抛出错误，这样UI不会完全崩溃
      return {
        linuxdo: [],
        zhihu: [],
        juejin: [],
        baidu: [],
        douyin: []
      }
    }
  }
} 