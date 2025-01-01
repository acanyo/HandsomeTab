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
          <Clock />
          <SearchBar />
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
import Clock from './components/Clock.vue'
import SearchBar from './components/SearchBar.vue'
import QuickLinks from './components/QuickLinks.vue'
import Weather from './components/Weather.vue'
import Settings from './components/Settings.vue'
import { useSettingsStore } from './stores/settings'

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
onMounted(async () => {
  settingsStore.loadSettings()
  if (settingsStore.autoChangeBackground) {
    await settingsStore.fetchDailyBackground()
  }
})
</script>

<style>
.app-container {
  position: relative;
  min-height: 100vh;
  overflow: hidden;
}

/* 背景层 */
.background-layer {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
}

.bg-image {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  min-width: 100%;
  min-height: 100%;
  width: auto;
  height: auto;
  object-fit: cover;
  transition: opacity 0.5s ease;
}

.bg-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    to bottom,
    rgba(0, 0, 0, 0.4) 0%,
    rgba(0, 0, 0, 0.2) 50%,
    rgba(0, 0, 0, 0.4) 100%
  );
  backdrop-filter: blur(var(--blur-amount));
  -webkit-backdrop-filter: blur(var(--blur-amount));
}

/* 内容层 */
.content-layer {
  position: relative;
  z-index: 2;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

/* 顶部区域 */
.header {
  padding: var(--spacing-unit);
}

.header-content {
  max-width: var(--container-width);
  margin: 0 auto;
  padding: var(--spacing-unit);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

/* 中心区域 */
.main-content {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--spacing-unit);
}

.center-container {
  max-width: 600px;
  width: 100%;
  text-align: center;
}

/* 底部区域 */
.footer {
  padding: var(--spacing-unit);
}

.footer-content {
  max-width: var(--container-width);
  margin: 0 auto;
  padding: var(--spacing-unit);
}

/* 设置按钮 */
.setting-btn {
  width: 48px;
  height: 48px;
  background: rgba(255, 255, 255, 0.1);
  border: none;
  color: var(--text-primary);
  transition: var(--transition-normal);
  backdrop-filter: blur(4px);
}

.setting-btn:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: rotate(30deg);
}

/* 加载状态 */
.loading-layer {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background: rgba(0, 0, 0, 0.8);
  z-index: 3;
}

.loading-icon {
  color: var(--text-primary);
  animation: rotate 1s linear infinite;
}

@keyframes rotate {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

/* 响应式设计 */
@media (max-width: 768px) {
  :root {
    --spacing-unit: 0.75rem;
  }

  .header-content,
  .footer-content {
    padding: var(--spacing-unit);
  }

  .center-container {
    padding: 0 var(--spacing-unit);
  }

  .settings-drawer {
    width: 100% !important;
  }
}

/* 深色模式适配 */
@media (prefers-color-scheme: dark) {
  .bg-overlay {
    background: linear-gradient(
      to bottom,
      rgba(0, 0, 0, 0.5) 0%,
      rgba(0, 0, 0, 0.3) 50%,
      rgba(0, 0, 0, 0.5) 100%
    );
  }
}
</style>