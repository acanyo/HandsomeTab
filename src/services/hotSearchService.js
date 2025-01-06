// 热搜服务

// API端点配置
const API_ENDPOINTS = {
  linuxdo: {
    url: '/api/linuxdo/top.json?period=daily',
    transform: (data) => {
      try {
        if (!data?.topic_list?.topics) return []
        return data.topic_list.topics
          .filter(topic => !topic.pinned && !topic.closed)  // 过滤掉置顶和关闭的帖子
          .map(topic => ({
            title: topic.title,
            url: `https://linux.do/t/topic/${topic.id}`,
            views: topic.views,
            likes: topic.like_count,
            replies: topic.posts_count - 1
          }))
          .sort((a, b) => b.views - a.views)  // 按浏览量排序
          .slice(0, 30)  // 取前30条
      } catch (error) {
        console.error('解析 LinuxDO 数据失败:', error)
        return []
      }
    }
  },
  zhihu: {
    url: 'https://api.cenguigui.cn/api/juhe/hotlist.php?type=zhihu',
    transform: (data) => {
      if (!data?.success || !data?.data) return []
      return data.data
        .map(item => ({
          title: item.title,
          url: item.url,
          hot: item.hot
        }))
        .slice(0, 30)
    }
  },
  baidu: {
    url: 'https://api.cenguigui.cn/api/juhe/hotlist.php?type=baidu',
    transform: (data) => {
      if (!data?.success || !data?.data) return []
      return data.data
        .map(item => ({
          title: item.title,
          url: item.url,
          hot: item.hot
        }))
        .slice(0, 30)
    }
  },
  douyin: {
    url: 'https://api.cenguigui.cn/api/juhe/hotlist.php?type=douyin',
    transform: (data) => {
      if (!data?.success || !data?.data) return []
      return data.data
        .map(item => ({
          title: item.title,
          url: item.url,
          hot: item.hot
        }))
        .slice(0, 30)
    }
  },
  bilibili: {
    url: 'https://api.cenguigui.cn/api/juhe/hotlist.php?type=bilihot',
    transform: (data) => {
      if (!data?.success || !data?.data) return []
      return data.data
        .map(item => ({
          title: item.title,
          url: item.url,
          hot: item.hot
        }))
        .slice(0, 30)
    }
  }
}

export const hotSearchService = {
  // 获取单个来源的热搜数据
  async fetchSourceData(source) {
    try {
      const endpoint = API_ENDPOINTS[source]
      if (!endpoint) return []

      const response = await fetch(endpoint.url)
      if (!response.ok) {
        throw new Error(`获取${source}数据失败: ${response.status}`)
      }

      const data = await response.json()
      return endpoint.transform(data)
    } catch (error) {
      console.error(`获取${source}数据失败:`, error)
      return []
    }
  },

  // 获取所有热搜数据
  async getHotSearch() {
    try {
      const results = await Promise.allSettled(
        Object.keys(API_ENDPOINTS).map(async source => {
          const data = await this.fetchSourceData(source)
          return [source, data]
        })
      )

      const hotData = {
        linuxdo: [],
        zhihu: [],
        baidu: [],
        douyin: [],
        bilibili: []
      }

      results.forEach(result => {
        if (result.status === 'fulfilled') {
          const [source, data] = result.value
          hotData[source] = data
        }
      })

      return hotData
    } catch (error) {
      console.error('获取热搜数据失败:', error)
      return {
        linuxdo: [],
        zhihu: [],
        baidu: [],
        douyin: [],
        bilibili: []
      }
    }
  }
} 