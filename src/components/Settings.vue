<template>
  <div class="settings">
    <el-tabs class="settings-tabs">
      <!-- 背景设置 -->
      <el-tab-pane label="背景">
        <div class="setting-section">
          <div class="setting-card">
            <!-- 自动更换设置 -->
            <div class="setting-item">
              <div class="setting-label">
                <span class="label-text">自动更换背景</span>
                <span class="label-desc">每天自动更换必应每日壁纸</span>
              </div>
              <el-switch
                v-model="settingsStore.autoChangeBackground"
                @change="handleAutoChangeSwitch"
              />
            </div>

            <div class="divider"></div>

            <!-- 自定义背景 -->
            <div class="setting-item">
              <div class="setting-label">
                <span class="label-text">自定义背景</span>
                <span class="label-desc">支持图片URL或本地上传</span>
              </div>
              <el-upload
                class="upload-btn"
                accept="image/*"
                :show-file-list="false"
                :before-upload="handleCustomBackground"
              >
                <el-button type="primary">
                  <el-icon><Upload /></el-icon>
                  上传图片
                </el-button>
              </el-upload>
            </div>

            <div class="custom-url-input">
              <el-input
                v-model="customUrl"
                placeholder="输入图片URL"
                clearable
                @keyup.enter="handleCustomUrl"
              >
                <template #append>
                  <el-button @click="handleCustomUrl">
                    确定
                  </el-button>
                </template>
              </el-input>
            </div>

            <div class="divider"></div>

            <!-- 背景预览 -->
            <div class="setting-preview">
              <div class="preview-header">
                <span class="label-text">当前背景</span>
                <div class="preview-actions">
                  <el-button 
                    type="primary" 
                    link 
                    @click="handleRandomBing"
                  >
                    <el-icon><Picture /></el-icon>
                    随机壁纸
                  </el-button>
                  <el-button 
                    type="danger" 
                    link 
                    @click="handleResetBackground"
                  >
                    <el-icon><Delete /></el-icon>
                    重置
                  </el-button>
                </div>
              </div>
              <div class="background-preview">
                <img 
                  v-if="settingsStore.background" 
                  :src="settingsStore.background" 
                  alt="背景预览"
                >
              </div>
            </div>
          </div>
        </div>
      </el-tab-pane>

      <!-- 常规设置 -->
      <el-tab-pane label="常规">
        <div class="setting-section">
          <div class="setting-card setting-placeholder">
            <el-empty description="更多设置开发中..." />
          </div>
        </div>
      </el-tab-pane>

      <!-- 快捷方式 -->
      <el-tab-pane label="快捷方式">
        <div class="setting-section">
          <div class="setting-card setting-placeholder">
            <el-empty description="快捷方式管理开发中..." />
          </div>
        </div>
      </el-tab-pane>

      <!-- 关于 -->
      <el-tab-pane label="关于">
        <div class="setting-section">
          <div class="setting-card about-section">
            <img 
              class="logo" 
              src="https://www.lik.cc/upload/logo.png" 
              alt="HandsomeTab"
            >
            <h2>HandsomeTab</h2>
            <p class="version">Version 1.0.0</p>
            <p class="description">
              一个简洁优雅的新标签页扩展，让你的浏览器更加美观实用。
            </p>
            <div class="links">
              <el-link type="primary" href="https://github.com/acanyo/HandsomeTab" target="_blank">
                <el-icon><Link /></el-icon>
                项目主页
              </el-link>
              <el-link type="info" href="https://www.lik.cc" target="_blank">
                <el-icon><Link /></el-icon>
                关于作者
              </el-link>
            </div>
          </div>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { Refresh, Link, Upload, Picture, Delete } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { useSettingsStore } from '../stores/settings'
import { backgroundService } from '../services/backgroundService'

const settingsStore = useSettingsStore()
const customUrl = ref('')

// 处理自动更换开关
const handleAutoChangeSwitch = (value) => {
  settingsStore.setAutoChange(value)
  if (value) {
    settingsStore.fetchDailyBackground()
  }
}

// 处理本地图片上传
const handleCustomBackground = async (file) => {
  try {
    const url = URL.createObjectURL(file)
    settingsStore.setBackground(url)
    settingsStore.setAutoChange(false)
    ElMessage.success('背景设置成功')
    return false
  } catch (error) {
    ElMessage.error('图片设置失败')
    return false
  }
}

// 处理自定义URL
const handleCustomUrl = async () => {
  if (!customUrl.value) {
    ElMessage.warning('请输入图片URL')
    return
  }
  try {
    settingsStore.setBackground(customUrl.value)
    settingsStore.setAutoChange(false)
    customUrl.value = ''
    ElMessage.success('背景设置成功')
  } catch (error) {
    ElMessage.error('图片URL无效')
  }
}

// 随机必应壁纸
const handleRandomBing = async () => {
  try {
    const url = await backgroundService.getRandomBackground()
    settingsStore.setBackground(url)
    ElMessage.success('背景更换成功')
  } catch (error) {
    ElMessage.error('背景更换失败')
  }
}

// 重置背景
const handleResetBackground = () => {
  settingsStore.resetBackground()
  ElMessage.success('背景已重置')
}
</script>

<style scoped>
.settings {
  height: 100%;
}

.settings-tabs {
  height: 100%;
}

.setting-section {
  padding: 1rem;
}

.setting-card {
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(10px);
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.04);
}

.setting-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.5rem 0;
}

.setting-label {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.label-text {
  font-size: 0.95rem;
  color: #2c3e50;
  font-weight: 500;
}

.label-desc {
  font-size: 0.8rem;
  color: #909399;
}

.divider {
  height: 1px;
  background: #ebeef5;
  margin: 1rem 0;
}

.preview-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.background-preview {
  width: 100%;
  height: 180px;
  border-radius: 8px;
  overflow: hidden;
  background: #f5f7fa;
  border: 1px solid #ebeef5;
}

.background-preview img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.setting-placeholder {
  min-height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* 关于页面样式 */
.about-section {
  text-align: center;
  padding: 2rem;
}

.app-title {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  margin-bottom: 1rem;
}

.app-title h2 {
  font-size: 1.8rem;
  color: #2c3e50;
  margin: 0;
}

.version {
  color: #909399;
  margin-bottom: 1rem;
}

.description {
  color: #606266;
  line-height: 1.6;
  max-width: 500px;
  margin: 0 auto 1.5rem;
}

.links {
  display: flex;
  gap: 1rem;
  justify-content: center;
}

:deep(.el-tabs__nav-wrap) {
  padding: 0 1rem;
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(10px);
}

:deep(.el-tabs__item) {
  font-size: 14px;
  height: 45px;
  line-height: 45px;
  padding: 0 1.5rem;
}

:deep(.el-tabs__content) {
  height: calc(100% - 45px);
  overflow-y: auto;
}

/* 自定义滚动条 */
:deep(.el-tabs__content)::-webkit-scrollbar {
  width: 4px;
}

:deep(.el-tabs__content)::-webkit-scrollbar-track {
  background: transparent;
}

:deep(.el-tabs__content)::-webkit-scrollbar-thumb {
  background: rgba(0, 0, 0, 0.1);
  border-radius: 4px;
}

:deep(.el-tabs__content)::-webkit-scrollbar-thumb:hover {
  background: rgba(0, 0, 0, 0.2);
}

.logo {
  width: 64px;
  height: 64px;
  margin-bottom: 1rem;
  border-radius: 12px;
}

.custom-url-input {
  margin-top: 1rem;
}

.preview-actions {
  display: flex;
  gap: 1rem;
}

.upload-btn :deep(.el-upload) {
  width: auto;
}
</style> 