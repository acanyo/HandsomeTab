<template>
  <div class="app-container">
    <!-- 背景图层 -->
    <div class="background-layer">
      <transition name="fade">
        <div 
          v-show="!settingsStore.backgroundLoading"
          class="bg-image" 
          :style="backgroundStyle"
        ></div>
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
          <div class="left-section">
            <Weather />
          </div>
          <div class="right-section">
            <el-button 
              class="setting-btn" 
              circle
              @click="showSettings = true"
            >
              <el-icon><Setting /></el-icon>
            </el-button>
          </div>
        </div>
      </header>

      <!-- 中心区域 -->
      <main class="main-content">
        <div class="center-container">
          <Clock class="clock-widget" />
          <SearchBar class="search-widget" />
        </div>
      </main>

      <!-- 底部区域 -->
      <footer class="footer">
        <div class="footer-content">
          <QuickLinks />
        </div>
      </footer>
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
import { useSettingsStore } from '../stores/settings'

const settingsStore = useSettingsStore()
const showSettings = ref(false)

const backgroundStyle = computed(() => ({
  backgroundImage: `url(${settingsStore.background})`,
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

.bg-image {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  transition: opacity 0.5s ease;
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
  padding: 1rem;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1200px;
  margin: 0 auto;
}

.main-content {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
}

.center-container {
  text-align: center;
}

.clock-widget {
  margin-bottom: 2rem;
}

.footer {
  padding: 1rem;
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
</style> 