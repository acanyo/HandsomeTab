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
      <el-button 
        type="primary" 
        link 
        @click="refreshHotSearch"
      >
        <el-icon><Refresh /></el-icon>
      </el-button>
    </div>
    
    <div class="hot-search-content" v-show="!isCollapsed">
      <el-tabs v-model="activeTab">
        <el-tab-pane label="LinuxDo" name="linuxdo">
          <div class="hot-search-list">
            <div 
              v-for="(item, index) in hotData.linuxdo" 
              :key="index"
              class="hot-item"
              @click="openLink(item.url)"
            >
              <span class="hot-index" :class="{ 'top-3': index < 3 }">{{ index + 1 }}</span>
              <div class="hot-content">
                <span class="hot-title">{{ item.title }}</span>
                <div class="hot-meta">
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
              </div>
            </div>
          </div>
        </el-tab-pane>
        <el-tab-pane label="知乎" name="zhihu">
          <div class="hot-search-list">
            <div 
              v-for="(item, index) in hotData.zhihu" 
              :key="index"
              class="hot-item"
              @click="openLink(item.url)"
            >
              <span class="hot-index" :class="{ 'top-3': index < 3 }">{{ index + 1 }}</span>
              <div class="hot-content">
                <span class="hot-title">{{ item.title }}</span>
              </div>
            </div>
          </div>
        </el-tab-pane>
        <el-tab-pane label="掘金" name="juejin">
          <div class="hot-search-list">
            <div 
              v-for="(item, index) in hotData.juejin" 
              :key="index"
              class="hot-item"
              @click="openLink(item.url)"
            >
              <span class="hot-index" :class="{ 'top-3': index < 3 }">{{ index + 1 }}</span>
              <div class="hot-content">
                <span class="hot-title">{{ item.title }}</span>
              </div>
            </div>
          </div>
        </el-tab-pane>
        <el-tab-pane label="百度" name="baidu">
          <div class="hot-search-list">
            <div 
              v-for="(item, index) in hotData.baidu" 
              :key="index"
              class="hot-item"
              @click="openLink(item.url)"
            >
              <span class="hot-index" :class="{ 'top-3': index < 3 }">{{ index + 1 }}</span>
              <div class="hot-content">
                <span class="hot-title">{{ item.title }}</span>
              </div>
            </div>
          </div>
        </el-tab-pane>
        <el-tab-pane label="抖音" name="douyin">
          <div class="hot-search-list">
            <div 
              v-for="(item, index) in hotData.douyin" 
              :key="index"
              class="hot-item"
              @click="openLink(item.url)"
            >
              <span class="hot-index" :class="{ 'top-3': index < 3 }">{{ index + 1 }}</span>
              <div class="hot-content">
                <span class="hot-title">{{ item.title }}</span>
              </div>
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
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

// 切换展开/收起
const toggleCollapse = () => {
  isCollapsed.value = !isCollapsed.value
}

// 获取热搜数据
const getHotSearch = async () => {
  try {
    const data = await hotSearchService.getHotSearch()
    hotData.value = data
  } catch (error) {
    ElMessage.error('获取热搜数据失败')
  }
}

// 格式化数字
const formatNumber = (num) => {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M'
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'k'
  }
  return num
}

// 刷新热搜
const refreshHotSearch = () => {
  getHotSearch()
}

// 打开链接
const openLink = (url) => {
  window.open(url, '_blank')
}

// 组件挂载时获取数据
onMounted(() => {
  getHotSearch()
})
</script>

<style scoped>
.hot-search {
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(10px);
  border-radius: 12px;
  padding: 1rem;
  width: 320px;
  max-height: 80vh;
  transition: all 0.3s ease;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.04);
}

.hot-search.collapsed {
  width: auto;
  padding: 8px;
  background: rgba(255, 255, 255, 0.6);
  border-radius: 8px;
}

.hot-search-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  position: sticky;
  top: 0;
  z-index: 1;
}

.collapsed .hot-search-header {
  margin-bottom: 0;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 8px;
}

.collapse-btn {
  padding: 4px;
  border-radius: 6px;
  transition: all 0.3s ease;
  height: 28px;
  width: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.collapse-btn:hover {
  background: rgba(64, 158, 255, 0.1);
}

.collapse-btn .el-icon {
  transition: transform 0.3s ease;
  font-size: 16px;
}

.collapsed .collapse-btn .el-icon {
  transform: rotate(180deg);
}

.hot-search-header .el-button {
  padding: 4px;
  height: 28px;
  width: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 6px;
  background: rgba(64, 158, 255, 0.1);
}

.hot-search-header .el-button:hover {
  background: rgba(64, 158, 255, 0.2);
}

.hot-search-header .el-icon {
  font-size: 16px;
  color: #409EFF;
}

.collapsed .hot-search-header .el-button {
  padding: 4px;
  height: 28px;
  width: 28px;
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
  overflow-y: auto;
  max-height: calc(80vh - 48px);
}

:deep(.el-tabs__header) {
  margin-bottom: 12px;
}

:deep(.el-tabs__nav-wrap::after) {
  height: 1px;
  background-color: rgba(235, 238, 245, 0.4);
}

.hot-search-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.hot-item {
  display: flex;
  gap: 12px;
  padding: 8px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s;
}

.hot-item:hover {
  background: rgba(64, 158, 255, 0.1);
}

.hot-index {
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  color: #909399;
  font-weight: 500;
}

.hot-index.top-3 {
  color: #409EFF;
  font-weight: bold;
}

.hot-content {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.hot-title {
  font-size: 14px;
  color: #2c3e50;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.hot-meta {
  display: flex;
  gap: 12px;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  color: #909399;
}

.meta-item .el-icon {
  font-size: 14px;
}

/* 自定义滚动条 */
.hot-search-content::-webkit-scrollbar {
  width: 4px;
}

.hot-search-content::-webkit-scrollbar-track {
  background: transparent;
}

.hot-search-content::-webkit-scrollbar-thumb {
  background: rgba(144, 147, 153, 0.3);
  border-radius: 2px;
}

.hot-search-content::-webkit-scrollbar-thumb:hover {
  background: rgba(144, 147, 153, 0.5);
}
</style> 