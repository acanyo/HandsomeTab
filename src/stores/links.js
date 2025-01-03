import { defineStore } from 'pinia'
import { ref } from 'vue'
import { defaultLinks } from '../config/links'

export const useLinksStore = defineStore('links', () => {
  const quickLinks = ref(JSON.parse(localStorage.getItem('quickLinks')) || defaultLinks)

  // 保存到本地存储
  const saveLinks = () => {
    localStorage.setItem('quickLinks', JSON.stringify(quickLinks.value))
  }

  // 重置为默认配置
  const resetToDefault = () => {
    quickLinks.value = defaultLinks
    saveLinks()
  }

  // 更新整个配置
  const updateLinks = (newLinks) => {
    quickLinks.value = newLinks
    saveLinks()
  }

  return {
    quickLinks,
    resetToDefault,
    updateLinks
  }
}) 