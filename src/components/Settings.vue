<template>
  <div class="settings">
    <el-tabs>
      <!-- 背景设置 -->
      <el-tab-pane label="背景">
        <el-form label-position="top">
          <el-form-item label="背景设置">
            <el-radio-group v-model="backgroundMode">
              <el-radio label="daily">每日更新</el-radio>
              <el-radio label="random">随机切换</el-radio>
              <el-radio label="custom">自定义</el-radio>
            </el-radio-group>

            <template v-if="backgroundMode === 'random'">
              <div class="tip">
                从必应壁纸历史中随机选择
                <el-button 
                  type="primary" 
                  link 
                  @click="changeRandomBackground"
                >
                  换一张
                </el-button>
              </div>
            </template>

            <template v-if="backgroundMode === 'custom'">
              <el-input
                v-model="customBackground"
                placeholder="输入图片URL"
                @change="selectBackground(customBackground)"
              >
                <template #append>
                  <el-button @click="selectBackground(customBackground)">确定</el-button>
                </template>
              </el-input>
            </template>
          </el-form-item>

          <el-form-item label="毛玻璃效果">
            <el-slider
              v-model="blurAmount"
              :min="0"
              :max="30"
              :step="1"
              :format-tooltip="value => `${value}px`"
              @change="updateTheme"
            >
              <template #marker>
                <el-icon><Picture /></el-icon>
              </template>
            </el-slider>
          </el-form-item>

          <el-form-item label="背景暗化">
            <el-slider
              v-model="overlayOpacity"
              :min="0"
              :max="100"
              :step="1"
              :format-tooltip="value => `${value}%`"
              @change="updateTheme"
            >
              <template #marker>
                <el-icon><Sunny /></el-icon>
              </template>
            </el-slider>
          </el-form-item>
        </el-form>
      </el-tab-pane>

      <!-- 搜索引擎设置 -->
      <el-tab-pane label="搜索">
        <el-form label-position="top">
          <el-form-item label="默认搜索引擎">
            <el-select v-model="defaultEngine" style="width: 100%">
              <el-option
                v-for="engine in searchEngines"
                :key="engine.value"
                :label="engine.label"
                :value="engine.value"
              >
                <img :src="engine.icon" class="engine-icon">
                {{ engine.label }}
              </el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="快捷搜索">
            <el-switch v-model="quickSearch" />
            <div class="tip">
              输入关键字时自动显示搜索建议
            </div>
          </el-form-item>
        </el-form>
      </el-tab-pane>

      <!-- 布局设置 -->
      <el-tab-pane label="布局">
        <el-form label-position="top">
          <el-form-item label="显示组件">
            <el-checkbox-group v-model="visibleComponents">
              <el-checkbox label="weather">天气</el-checkbox>
              <el-checkbox label="todo">待办事项</el-checkbox>
              <el-checkbox label="notes">笔记</el-checkbox>
              <el-checkbox label="quote">每日一句</el-checkbox>
            </el-checkbox-group>
          </el-form-item>

          <el-form-item label="时钟样式">
            <el-radio-group v-model="clockStyle">
              <el-radio label="digital">数字时钟</el-radio>
              <el-radio label="analog">模拟时钟</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-form>
      </el-tab-pane>

      <!-- 主题设置 -->
      <el-tab-pane label="主题">
        <el-form label-position="top">
          <el-form-item label="主题模式">
            <el-radio-group v-model="themeMode">
              <el-radio label="light">浅色</el-radio>
              <el-radio label="dark">深色</el-radio>
              <el-radio label="auto">跟随系统</el-radio>
            </el-radio-group>
          </el-form-item>

          <el-form-item label="背景模糊">
            <el-slider
              v-model="blurAmount"
              :min="0"
              :max="20"
              :step="1"
              @change="updateTheme"
            />
          </el-form-item>

          <el-form-item label="透明度">
            <el-slider
              v-model="opacity"
              :min="0"
              :max="100"
              :step="1"
            />
          </el-form-item>
        </el-form>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { Picture, Sunny } from '@element-plus/icons-vue'
import { useSettingsStore } from '../stores/settings'
import { backgroundService } from '../services/backgroundService'

const emit = defineEmits(['update:background'])
const store = useSettingsStore()

const backgroundType = ref('preset')
const customBackground = ref('')
const defaultEngine = ref('google')
const currentBackground = ref(store.background)

const presetBackgrounds = [
  '/backgrounds/1.jpg',
  '/backgrounds/2.jpg',
  '/backgrounds/3.jpg',
  // 添加更多预设背景
]

const backgroundMode = computed({
  get: () => store.backgroundMode,
  set: async (value) => {
    store.backgroundMode = value
    if (value === 'daily') {
      await store.fetchDailyBackground()
    } else if (value === 'random') {
      await changeRandomBackground()
    }
  }
})

const changeRandomBackground = async () => {
  const url = await backgroundService.getRandomBackground()
  if (url) {
    await store.setBackground(url)
  }
}

const selectBackground = async (url) => {
  if (url) {
    await store.setBackground(url)
  }
}

const blurAmount = computed({
  get: () => store.theme.blur,
  set: (value) => updateTheme({ blur: value })
})

const overlayOpacity = computed({
  get: () => store.theme.opacity * 100,
  set: (value) => updateTheme({ opacity: value / 100 })
})

const updateTheme = (updates) => {
  store.setTheme(updates)
}
</script>

<style scoped>
.preset-backgrounds {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
  margin-top: 10px;
}

.bg-item {
  aspect-ratio: 16/9;
  background-size: cover;
  background-position: center;
  border-radius: 4px;
  cursor: pointer;
  border: 2px solid transparent;
}

.bg-item.active {
  border-color: var(--el-color-primary);
}

.tip {
  margin-top: 0.5rem;
  color: #909399;
  font-size: 0.9rem;
}

.settings :deep(.el-slider) {
  width: 100%;
  margin-top: 8px;
}

.settings :deep(.el-slider__runway) {
  margin: 16px 0;
}

.settings :deep(.el-slider__button) {
  width: 20px;
  height: 20px;
}

.settings :deep(.el-slider__button-wrapper) {
  top: -9px;
}
</style> 