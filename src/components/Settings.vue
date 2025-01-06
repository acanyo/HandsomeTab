<template>
  <div class="settings">
    <el-tabs class="settings-tabs">
      <!-- 背景设置 -->
      <el-tab-pane label="背景">
        <div class="setting-section">
          <div class="setting-card">
            <!-- 当前背景 -->
            <div class="setting-preview">
              <div class="setting-title">当前背景</div>
              <div class="preview-actions">
                <div class="main-actions">
                  <el-button 
                    type="primary"
                    @click="handleRandomBing"
                  >
                    <el-icon><Picture /></el-icon>
                    随机图片
                  </el-button>
                  <el-button 
                    type="primary"
                    @click="handleRandomVideo"
                  >
                    <el-icon><VideoPlay /></el-icon>
                    随机视频
                  </el-button>
                </div>
                <div class="reset-action">
                  <el-button 
                    type="danger"
                    plain
                    @click="handleResetBackground"
                  >
                    <el-icon><Delete /></el-icon>
                    重置
                  </el-button>
                </div>
              </div>
              <div class="background-preview">
                <img 
                  v-if="settingsStore.background && !settingsStore.background.endsWith('.mp4')" 
                  :src="settingsStore.background" 
                  alt="背景预览"
                  class="preview-image"
                >
                <video
                  v-else-if="settingsStore.background?.endsWith('.mp4')"
                  class="preview-video"
                  :src="settingsStore.background"
                  :poster="settingsStore.backgroundPoster"
                  muted
                  loop
                  autoplay
                  playsinline
                ></video>
              </div>
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
                  <el-button @click="handleCustomUrl">确定</el-button>
                </template>
              </el-input>
            </div>
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
import { Refresh, Link, Upload, Picture, Delete, VideoPlay } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { useSettingsStore } from '../stores/settings'
import { backgroundService } from '../services/backgroundService'
import wallpapers from '../utils/wallpapers.json'

const settingsStore = useSettingsStore()
const customUrl = ref('')
const videoWallpapers = ref(wallpapers)

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

// 随机视频壁纸
const handleRandomVideo = () => {
  try {
    const videos = videoWallpapers.value.data
    if (!videos || videos.length === 0) {
      ElMessage.error('暂无可用的动态壁纸')
      return
    }

    // 获取当前壁纸的索引
    const currentIndex = videos.findIndex(v => v.url === settingsStore.background)
    let randomIndex

    // 确保不会随机到当前壁纸
    do {
      randomIndex = Math.floor(Math.random() * videos.length)
    } while (randomIndex === currentIndex && videos.length > 1)

    const randomVideo = videos[randomIndex]
    if (!randomVideo || !randomVideo.url) {
      ElMessage.error('动态壁纸加载失败')
      return
    }

    // 设置背景时同时设置预览图
    settingsStore.setBackground(randomVideo.url, randomVideo.poster, false)
      .then(() => {
        ElMessage.success('动态壁纸更换成功')
      })
      .catch(() => {
        ElMessage.error('动态壁纸切换失败')
      })
  } catch (error) {
    console.error('随机切换动态壁纸失败:', error)
    ElMessage.error('动态壁纸切换失败')
  }
}

// 重置背景
const handleResetBackground = () => {
  settingsStore.resetBackground()
  ElMessage.success('背景已重置')
}

// 更新背景
const updateBackground = (url) => {
  settingsStore.setBackground(url)
  settingsStore.setAutoChange(false)
  ElMessage.success('背景设置成功')
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

.setting-preview {
  margin-bottom: 1rem;
}

.setting-label {
  margin-bottom: 12px;
}

.preview-actions {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 12px;
}

.main-actions {
  display: flex;
  gap: 8px;
}

.main-actions .el-button,
.reset-action .el-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 8px 16px;
  height: 32px;
}

.main-actions .el-icon,
.reset-action .el-icon {
  margin-right: 4px;
}

.background-preview {
  width: 100%;
  height: 200px;
  border-radius: 8px;
  overflow: hidden;
  background: rgba(245, 247, 250, 0.6);
  border: 1px solid rgba(235, 238, 245, 0.2);
  backdrop-filter: blur(10px);
}

.preview-image,
.preview-video {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 8px;
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

.custom-url-input {
  margin-top: 1rem;
}

.upload-btn :deep(.el-upload) {
  width: auto;
}

.about-section {
  text-align: center;
  padding: 2rem;
}

.logo {
  width: 64px;
  height: 64px;
  margin-bottom: 1rem;
  border-radius: 12px;
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

.preview-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.setting-label {
  font-size: 16px;
  font-weight: 500;
  color: #2c3e50;
}

.preview-actions {
  display: flex;
  gap: 12px;
  align-items: center;
}

.action-btn {
  background-color: #409EFF;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  gap: 4px;
}

.action-btn:hover {
  background-color: #66b1ff;
}

.reset-btn {
  background-color: rgba(255, 255, 255, 0.9);
  color: #F56C6C;
  border: 1px solid rgba(245, 108, 108, 0.2);
  padding: 8px 16px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  gap: 4px;
}

.reset-btn:hover {
  background-color: #FEF0F0;
  color: #F56C6C;
  border-color: #F56C6C;
}

.preview-actions .el-icon {
  font-size: 16px;
}
</style> 