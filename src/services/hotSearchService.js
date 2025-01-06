// 热搜服务
export const hotSearchService = {
  // 获取热搜数据
  async getHotSearch() {
    try {
      const hotSearchData = {
        linuxdo: [],
        zhihu: [],
        juejin: [],
        baidu: [],
        douyin: []
      }

      try {
        // 获取 Linux.do 数据
        const linuxdoResponse = await fetch('/api/linuxdo/top.json')
        if (linuxdoResponse.ok) {
          const linuxdoData = await linuxdoResponse.json()
          if (linuxdoData?.topic_list?.topics) {
            hotSearchData.linuxdo = linuxdoData.topic_list.topics
              .map(topic => ({
                title: topic.title,
                url: `https://linux.do/t/topic/${topic.id}`,
                views: topic.views,
                likes: topic.like_count,
                replies: topic.posts_count - 1
              }))
              .sort((a, b) => b.views - a.views)
              .slice(0, 30)
          }
        }
      } catch (error) {
        console.error('获取 Linux.do 数据失败:', error)
      }

      try {
        // 获取知乎热搜
        const zhihuResponse = await fetch('/api/zhihu/topstory/hot-list')
        if (zhihuResponse.ok) {
          const zhihuData = await zhihuResponse.json()
          if (zhihuData?.data) {
            hotSearchData.zhihu = zhihuData.data
              .filter(item => item?.target?.title && item?.target?.id)
              .map(item => ({
                title: item.target.title,
                url: `https://www.zhihu.com/question/${item.target.id}`
              }))
          }
        }
      } catch (error) {
        console.error('获取知乎热搜失败:', error)
      }

      try {
        // 获取百度热搜
        const baiduResponse = await fetch('/api/baidu/api/board?platform=wise&tab=realtime')
        if (baiduResponse.ok) {
          const baiduData = await baiduResponse.json()
          if (baiduData?.data?.cards?.[0]?.content) {
            hotSearchData.baidu = baiduData.data.cards[0].content
              .filter(item => item?.query && item?.url)
              .map(item => ({
                title: item.query,
                url: item.url
              }))
          }
        }
      } catch (error) {
        console.error('获取百度热搜失败:', error)
      }

      try {
        // 获取掘金热搜
        const juejinResponse = await fetch('/api/juejin/content_api/v1/content/article_rank?category_id=1&type=hot')
        if (juejinResponse.ok) {
          const juejinData = await juejinResponse.json()
          if (juejinData?.data) {
            hotSearchData.juejin = juejinData.data
              .filter(item => item?.article_info?.title && item?.article_id)
              .map(item => ({
                title: item.article_info.title,
                url: `https://juejin.cn/post/${item.article_id}`
              }))
          }
        }
      } catch (error) {
        console.error('获取掘金热搜失败:', error)
      }

      return hotSearchData
    } catch (error) {
      console.error('获取热搜数据失败:', error)
      throw error
    }
  }
} 