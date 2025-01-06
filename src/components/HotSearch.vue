<template>
  <div class="hot-search" :class="{ 'collapsed': isCollapsed }">
    <div class="hot-search-header">
      <div class="header-left">
        <el-button 
          type="primary" 
          link
          class="collapse-btn"
          @click="toggleCollapse"
        >
          <el-icon><ArrowRight /></el-icon>
        </el-button>
        <span class="title">热搜</span>
      </div>
      <div class="header-right">
        <el-button 
          type="primary" 
          link 
          :loading="isLoading"
          :disabled="isLoading"
          @click="refreshHotSearch"
        >
          <el-icon><Refresh /></el-icon>
        </el-button>
      </div>
    </div>
    
    <div class="hot-search-content" v-show="!isCollapsed">
      <el-tabs v-model="activeTab">
        <el-tab-pane 
          v-for="(items, type) in hotData" 
          :key="type" 
          :label="getTabLabel(type)" 
          :name="type"
        >
          <div v-if="isLoading" class="loading-container">
            <el-skeleton :rows="10" animated />
          </div>
          <div v-else-if="error" class="error-container">
            <el-empty :description="error">
              <template #extra>
                <el-button type="primary" @click="refreshHotSearch">重试</el-button>
              </template>
            </el-empty>
          </div>
          <div v-else class="hot-search-list">
            <div 
              v-for="(item, index) in items" 
              :key="index"
              class="hot-item"
              @click="openLink(item.url)"
            >
              <span class="hot-index" :class="{ 'top-3': index < 3 }">{{ index + 1 }}</span>
              <div class="hot-content">
                <span class="hot-title">{{ item.title }}</span>
                <div v-if="type === 'linuxdo'" class="hot-meta">
                  <span class="meta-item">
                    <el-icon><View /></el-icon>
                    {{ formatNumber(item.views) }}
                  </span>
                  <span class="meta-item">
                    <el-icon><ChatDotRound /></el-icon>
                    {{ item.replies }}
                  </span>
                  <span class="meta-item">
                    <el-icon><Star /></el-icon>
                    {{ item.likes }}
                  </span>
                </div>
                <div v-if="item.date" class="hot-time">
                  {{ formatTime(item.date) }}
                </div>
              </div>
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { Refresh, View, ChatDotRound, Star, ArrowRight } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { hotSearchService } from '../services/hotSearchService'

const hotData = ref({
  linuxdo: [],
  zhihu: [],
  juejin: [],
  baidu: [],
  douyin: []
})
const activeTab = ref('linuxdo')
const isCollapsed = ref(true) // 默认收起
const isLoading = ref(false)
const error = ref('')
let refreshTimer = null

// 获取标签名称
const getTabLabel = (type) => {
  const labels = {
    linuxdo: 'LinuxDo',
    zhihu: '知乎',
    juejin: '掘金',
    baidu: '百度',
    douyin: '抖音'
  }
  return labels[type] || type
}

// 切换展开/收起
const toggleCollapse = () => {
  isCollapsed.value = !isCollapsed.value
}

// 获取热搜数据
const getHotSearch = async () => {
  isLoading.value = true
  error.value = ''
  
  try {
    const data = await hotSearchService.getHotSearch()
    hotData.value = data
  } catch (err) {
    error.value = '获取热搜数据失败'
    ElMessage.error('获取热搜数据失败')
  } finally {
    isLoading.value = false
  }
}

// 格式化数字
const formatNumber = (num) => {
  if (!num) return '0'
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M'
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'k'
  }
  return num
}

// 格式化时间
const formatTime = (date) => {
  if (!date) return ''
  const now = new Date()
  const diff = now - new Date(date)
  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)

  if (days > 0) return `${days}天前`
  if (hours > 0) return `${hours}小时前`
  if (minutes > 0) return `${minutes}分钟前`
  return '刚刚'
}

// 刷新热搜
const refreshHotSearch = () => {
  if (isLoading.value) return
  getHotSearch()
}

// 打开链接
const openLink = (url) => {
  if (!url) return
  window.open(url, '_blank')
}

// 自动刷新（每10分钟）
const startAutoRefresh = () => {
  refreshTimer = setInterval(refreshHotSearch, 10 * 60 * 1000)
}

// 组件挂载时获取数据并开始自动刷新
onMounted(() => {
  getHotSearch()
  startAutoRefresh()
})

// 组件卸载时清除定时器
onBeforeUnmount(() => {
  if (refreshTimer) {
    clearInterval(refreshTimer)
  }
})
</script>

<style scoped>
.hot-search {
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(20px);
  border-radius: 16px;
  padding: 1.2rem;
  width: 360px;
  height: 85vh;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  display: flex;
  flex-direction: column;
  border: 1px solid rgba(255, 255, 255, 0.5);
}

.hot-search.collapsed {
  width: auto;
  height: auto;
  padding: 8px;
  background: rgba(255, 255, 255, 0.8);
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.3);
  backdrop-filter: blur(10px);
  transform: translateX(0);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.hot-search.collapsed:hover {
  background: rgba(255, 255, 255, 0.9);
  transform: translateX(4px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.collapsed .hot-search-header {
  margin: 0;
  padding: 0;
  border: none;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 8px;
}

.header-right {
  display: flex;
  align-items: center;
}

.collapse-btn {
  padding: 6px;
  border-radius: 8px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  height: 32px;
  width: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.collapse-btn:hover {
  background: rgba(64, 158, 255, 0.08);
  border-color: rgba(64, 158, 255, 0.2);
  transform: scale(1.05);
}

.collapse-btn .el-icon {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  font-size: 18px;
  color: #409EFF;
}

.collapsed .collapse-btn .el-icon {
  transform: rotate(180deg);
}

.collapsed .collapse-btn:hover .el-icon {
  transform: rotate(180deg) scale(1.1);
}

.hot-search-header .el-button {
  padding: 4px;
  height: 28px;
  width: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 6px;
}

.hot-search-header .el-button:hover {
  background: rgba(64, 158, 255, 0.1);
}

.hot-search-header .el-icon {
  font-size: 16px;
  color: #409EFF;
}

.title {
  font-size: 16px;
  font-weight: 500;
  color: #2c3e50;
}

.collapsed .title {
  display: none;
}

.hot-search-content {
  flex: 1;
  overflow-y: auto;
  min-height: 0;
}

:deep(.el-tabs) {
  height: 100%;
  display: flex;
  flex-direction: column;
}

:deep(.el-tabs__header) {
  margin-bottom: 12px;
  flex-shrink: 0;
}

:deep(.el-tabs__content) {
  flex: 1;
  overflow-y: auto;
  min-height: 0;
}

:deep(.el-tab-pane) {
  height: 100%;
}

:deep(.el-tabs__nav-wrap::after) {
  height: 1px;
  background-color: rgba(0, 0, 0, 0.05);
}

:deep(.el-tabs__item) {
  color: #606266;
  font-size: 15px;
  padding: 0 16px;
  height: 36px;
  line-height: 36px;
  transition: all 0.3s;
}

:deep(.el-tabs__item.is-active) {
  color: #409EFF;
  font-weight: 600;
}

:deep(.el-tabs__item:hover) {
  color: #409EFF;
}

.loading-container,
.error-container {
  padding: 16px 0;
}

.hot-search-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 4px;
}

.hot-item {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 12px;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  background: rgba(255, 255, 255, 0.5);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.hot-item:hover {
  background: rgba(64, 158, 255, 0.08);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.hot-index {
  min-width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 15px;
  font-weight: 600;
  color: #909399;
  background: rgba(0, 0, 0, 0.04);
  border-radius: 8px;
}

.hot-index.top-3 {
  color: #fff;
  font-weight: bold;
}

.hot-index.top-3:nth-child(1) {
  background: #f56c6c;
}

.hot-index.top-3:nth-child(2) {
  background: #e6a23c;
}

.hot-index.top-3:nth-child(3) {
  background: #409eff;
}

.hot-content {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.hot-title {
  font-size: 15px;
  color: #2c3e50;
  line-height: 1.5;
  margin-bottom: 4px;
}

.hot-meta {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
  padding-top: 4px;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  color: #909399;
  background: rgba(0, 0, 0, 0.02);
  padding: 2px 8px;
  border-radius: 4px;
}

.meta-item .el-icon {
  font-size: 14px;
}

.hot-time {
  font-size: 12px;
  color: #909399;
}

/* 自定义滚动条 */
.hot-search-content::-webkit-scrollbar {
  width: 6px;
}

.hot-search-content::-webkit-scrollbar-track {
  background: transparent;
}

.hot-search-content::-webkit-scrollbar-thumb {
  background: rgba(144, 147, 153, 0.2);
  border-radius: 3px;
  transition: all 0.3s;
}

.hot-search-content::-webkit-scrollbar-thumb:hover {
  background: rgba(144, 147, 153, 0.4);
}

/* 移动端适配 */
@media (max-width: 768px) {
  .hot-search {
    width: 100%;
    max-height: none;
    border-radius: 8px;
  }

  .hot-search.collapsed {
    width: auto;
  }

  .hot-search-content {
    max-height: none;
  }

  :deep(.el-tabs__item) {
    padding: 0 8px;
  }
}
</style> 