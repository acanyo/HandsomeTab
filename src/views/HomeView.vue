<template>
  <div class="app-container">
    <!-- 背景图层 -->
    <div class="background-layer">
      <transition name="fade">
        <div 
          v-show="!settingsStore.backgroundLoading"
          class="bg-container" 
        >
          <video
            v-if="isVideoBackground"
            class="bg-video"
            :src="settingsStore.background"
            autoplay
            loop
            muted
            playsinline
          ></video>
          <div
            v-else
            class="bg-image"
            :style="backgroundStyle"
          ></div>
        </div>
      </transition>
      <div class="bg-overlay"></div>
    </div>

    <!-- 加载状态 -->
    <div 
      v-if="settingsStore.backgroundLoading"
      class="loading-layer"
    >
      <el-icon class="loading-icon" :size="32"><Loading /></el-icon>
    </div>

    <!-- 主要内容 -->
    <div class="content-layer">
      <!-- 顶部区域 -->
      <header class="header">
        <div class="header-content">
          <div class="top-widgets">
            <Clock class="clock-widget" />
            <SearchBar class="search-widget" />
          </div>
        </div>
      </header>

      <!-- 中心区域 -->
      <main class="main-content">
        <div class="center-container">
          <QuickLinks />
        </div>
        <div class="quote-container">
          <DailyQuote />
        </div>
      </main>

      <!-- 左上角天气 -->
      <div class="top-left-tools">
        <Weather />
      </div>

      <!-- 右上角设置 -->
      <div class="top-tools">
        <el-button 
          class="setting-btn" 
          circle
          @click="showSettings = true"
        >
          <el-icon><Setting /></el-icon>
        </el-button>
      </div>
    </div>

    <!-- 设置面板 -->
    <el-drawer
      v-model="showSettings"
      title="个性化设置"
      direction="rtl"
      size="400px"
      class="settings-drawer"
    >
      <Settings @update:background="updateBackground" />
    </el-drawer>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { Setting, Loading } from '@element-plus/icons-vue'
import Clock from '../components/Clock.vue'
import SearchBar from '../components/SearchBar.vue'
import QuickLinks from '../components/QuickLinks.vue'
import Weather from '../components/Weather.vue'
import Settings from '../components/Settings.vue'
import DailyQuote from '../components/DailyQuote.vue'
import { useSettingsStore } from '../stores/settings'

const settingsStore = useSettingsStore()
const showSettings = ref(false)

const isVideoBackground = computed(() => {
  const bg = settingsStore.background
  return bg && (bg.endsWith('.mp4') || bg.endsWith('.webm'))
})

const backgroundStyle = computed(() => ({
  backgroundImage: isVideoBackground.value ? 'none' : `url(${settingsStore.background})`,
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  backgroundRepeat: 'no-repeat'
}))

const updateBackground = (url) => {
  settingsStore.setBackground(url)
}

// 自动更新背景
onMounted(() => {
  settingsStore.loadSettings()
})
</script>

<style>
.app-container {
  position: relative;
  min-height: 100vh;
  overflow: hidden;
}

.background-layer {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -1;
}

.bg-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  transition: opacity 0.5s ease;
}

.bg-video {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.bg-image {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.bg-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.2);
}

.content-layer {
  position: relative;
  z-index: 1;
  height: 100vh;
  display: flex;
  flex-direction: column;
  padding-top: 2rem;
}

.loading-layer {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background: rgba(0, 0, 0, 0.5);
  z-index: 999;
}

.loading-icon {
  color: white;
  animation: rotate 1s linear infinite;
}

.header {
  padding: 0;
}

.header-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  max-width: 1200px;
  margin: 0 auto;
}

.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2rem 1rem;
  margin-top: 2rem;
}

.center-container {
  text-align: center;
  width: 100%;
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 1rem;
}

.clock-widget {
  margin-bottom: 0;
}

.footer {
  padding: 1rem;
  margin-top: auto;
}

.footer-content {
  max-width: 1200px;
  margin: 0 auto;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

@keyframes rotate {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

/* 设置抽屉样式 */
.settings-drawer {
  background: rgba(255, 255, 255, 0.9) !important;
  backdrop-filter: blur(10px);
}

.setting-btn {
  background: rgba(255, 255, 255, 0.2);
  border: none;
  backdrop-filter: blur(5px);
}

.setting-btn:hover {
  background: rgba(255, 255, 255, 0.3);
}

/* 修改时钟样式 */
:deep(.clock) {
  margin-bottom: 0;
}

:deep(.clock .time) {
  font-size: 4.5rem;
  font-weight: 200;
  letter-spacing: 2px;
  margin-bottom: 0.25rem;
}

:deep(.clock .date) {
  font-size: 1rem;
  opacity: 0.9;
  font-weight: 300;
  margin-bottom: 0.5rem;
}

/* 添加新的布局容器 */
.top-widgets {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  width: 100%;
  max-width: 650px;
  margin: 0 auto;
}

/* 移除天气组件的背景和边框 */
:deep(.weather-widget) {
  background: transparent;
  border: none;
  backdrop-filter: none;
  padding: 0;
  min-width: auto;
}

/* 移动端适配 */
@media (max-width: 768px) {
  .content-layer {
    padding-top: 1rem;
  }

  .main-content {
    padding: 1rem;
    margin-top: 1rem;
  }

  .center-container {
    padding: 0 0.5rem;
  }

  .top-tools {
    top: 0.5rem;
    right: 0.5rem;
  }

  .top-left-tools {
    top: 0.5rem;
    left: 0.5rem;
  }

  :deep(.links-grid) {
    grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));
    gap: 0.8rem;
  }

  :deep(.link-card) {
    padding: 0.8rem;
  }

  :deep(.link-icon) {
    width: 32px;
    height: 32px;
    margin-bottom: 0.6rem;
  }

  :deep(.link-name) {
    font-size: 0.8rem;
  }
}

/* 添加右上角工具栏样式 */
.top-tools {
  position: fixed;
  top: 1rem;
  right: 1rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  z-index: 100;
}

/* 添加左侧天气组件容器 */
.top-left-tools {
  position: fixed;
  top: 1rem;
  left: 1rem;
  z-index: 100;
}

/* 优化内容布局 */
.content-layer {
  position: relative;
  z-index: 1;
  height: 100vh;
  display: flex;
  flex-direction: column;
  padding-top: 2rem;
}

.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2rem 1rem;
  margin-top: 2rem;
}

.center-container {
  text-align: center;
  width: 100%;
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 1rem;
}

/* 优化快捷链接区域 */
:deep(.quick-links-container) {
  max-height: 60vh;
  padding: 0;
}

:deep(.links-grid) {
  grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
  gap: 1rem;
}

:deep(.link-card) {
  padding: 1rem;
}

:deep(.link-icon) {
  width: 40px;
  height: 40px;
  margin-bottom: 0.8rem;
}

:deep(.link-name) {
  font-size: 0.9rem;
}

/* 修改每日一句容器样式 */
.quote-container {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  width: 100%;
  z-index: 10;
}

@media (max-width: 768px) {
  .quote-container {
    bottom: 0;
  }
}
</style> 