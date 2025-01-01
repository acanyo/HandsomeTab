import { defineStore } from 'pinia'

export const useLinksStore = defineStore('links', {
  state: () => ({
    quickLinks: [
      {
        title: '常用',
        links: [
          {
            name: '哔哩哔哩',
            url: 'https://www.bilibili.com',
            icon: 'https://www.bilibili.com/favicon.ico'
          },
          {
            name: '知乎',
            url: 'https://www.zhihu.com',
            icon: 'https://static.zhihu.com/heifetz/favicon.ico'
          }
        ]
      },
      {
        title: '工作',
        links: [
          {
            name: 'GitHub',
            url: 'https://github.com',
            icon: 'https://github.com/favicon.ico'
          },
          {
            name: '掘金',
            url: 'https://juejin.cn',
            icon: 'https://lf3-cdn-tos.bytescm.com/obj/static/xitu_juejin_web//static/favicons/favicon-32x32.png'
          }
        ]
      }
    ]
  }),
  actions: {
    addLink(groupTitle, link) {
      const group = this.quickLinks.find(g => g.title === groupTitle)
      if (group) {
        group.links.push(link)
        this.saveToLocalStorage()
      }
    },
    removeLink(groupTitle, url) {
      const group = this.quickLinks.find(g => g.title === groupTitle)
      if (group) {
        group.links = group.links.filter(link => link.url !== url)
        this.saveToLocalStorage()
      }
    },
    saveToLocalStorage() {
      localStorage.setItem('quickLinks', JSON.stringify(this.quickLinks))
    },
    loadFromLocalStorage() {
      const savedLinks = localStorage.getItem('quickLinks')
      if (savedLinks) {
        this.quickLinks = JSON.parse(savedLinks)
      }
    }
  }
}) 