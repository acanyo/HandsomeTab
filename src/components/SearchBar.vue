<template>
  <div class="search-container">
    <div class="search-box" :class="{ 'is-focused': isFocused }">
      <!-- 搜索引擎选择器 -->
      <div class="engine-selector" @click="showEngineSelect = true">
        <img :src="currentEngine.icon" :alt="currentEngine.label" class="engine-icon">
        <span class="engine-label">{{ currentEngine.label }}</span>
        <el-icon class="arrow-icon"><ArrowDown /></el-icon>
      </div>

      <!-- 搜索输入框 -->
      <el-input
        v-model="searchKeyword"
        class="search-input"
        :placeholder="placeholder"
        @focus="handleFocus"
        @blur="handleBlur"
        @keyup.enter="handleSearch"
        clearable
      >
        <template #prefix>
          <el-icon class="search-icon"><Search /></el-icon>
        </template>
      </el-input>
    </div>

    <!-- 搜索建议 -->
    <transition name="fade-slide">
      <div v-if="showSuggestions && suggestions.length" class="suggestions-panel">
        <div
          v-for="(item, index) in suggestions"
          :key="index"
          class="suggestion-item"
          @click="selectSuggestion(item)"
          @mouseenter="highlightIndex = index"
          :class="{ 'is-active': highlightIndex === index }"
        >
          <el-icon><Search /></el-icon>
          <span v-html="highlightKeyword(item)"></span>
        </div>
      </div>
    </transition>

    <!-- 搜索引擎选择对话框 -->
    <el-dialog
      v-model="showEngineSelect"
      title="选择搜索引擎"
      width="300px"
      class="engine-dialog"
      :show-close="true"
      :close-on-click-modal="true"
    >
      <div class="engine-list">
        <div
          v-for="engine in searchEngines"
          :key="engine.value"
          class="engine-item"
          :class="{ 'is-active': engine.value === currentEngine.value }"
          @click="selectEngine(engine)"
        >
          <img :src="engine.icon" :alt="engine.label" class="engine-icon">
          <span class="engine-name">{{ engine.label }}</span>
          <el-icon v-if="engine.value === currentEngine.value" class="check-icon"><Check /></el-icon>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { Search, ArrowDown, Check } from '@element-plus/icons-vue'
import { useSettingsStore } from '../stores/settings'
import { onKeyStroke } from '@vueuse/core'
import debounce from 'lodash/debounce'

const store = useSettingsStore()
const searchKeyword = ref('')
const isFocused = ref(false)
const showEngineSelect = ref(false)
const showSuggestions = ref(false)
const suggestions = ref([])
const highlightIndex = ref(-1)

const searchEngines = [
  {
    label: '百度',
    value: 'baidu',
    icon: 'https://www.baidu.com/favicon.ico',
    searchUrl: 'https://www.baidu.com/s?wd=',
    suggestUrl: 'https://suggestion.baidu.com/su?wd='
  },
  {
    label: 'Google',
    value: 'google',
    icon: 'https://www.google.com/favicon.ico',
    searchUrl: 'https://www.google.com/search?q=',
    suggestUrl: 'https://suggestqueries.google.com/complete/search?client=chrome&q='
  },
  {
    label: '必应',
    value: 'bing',
    icon: 'https://www.bing.com/favicon.ico',
    searchUrl: 'https://www.bing.com/search?q=',
    suggestUrl: 'https://api.bing.com/qsonhs.aspx?q='
  },
  {
    label: '搜狗',
    value: 'sogou',
    icon: 'https://www.sogou.com/favicon.ico',
    searchUrl: 'https://www.sogou.com/web?query=',
    suggestUrl: 'https://www.sogou.com/suggnew/ajajjson?key='
  },
  {
    label: '360',
    value: '360',
    icon: 'https://www.so.com/favicon.ico',
    searchUrl: 'https://www.so.com/s?q=',
    suggestUrl: 'https://sug.so.360.cn/suggest?word='
  },
  {
    label: 'DuckDuckGo',
    value: 'duckduckgo',
    icon: 'https://duckduckgo.com/favicon.ico',
    searchUrl: 'https://duckduckgo.com/?q=',
    suggestUrl: 'https://duckduckgo.com/ac/?q='
  }
]

const currentEngine = computed(() => {
  return searchEngines.find(engine => engine.value === store.searchEngine) || searchEngines[0]
})

const placeholder = computed(() => `在 ${currentEngine.value.label} 中搜索...`)

// 处理搜索
const handleSearch = () => {
  if (!searchKeyword.value.trim()) return
  const url = currentEngine.value.searchUrl + encodeURIComponent(searchKeyword.value)
  window.open(url, '_blank')
  searchKeyword.value = ''
  showSuggestions.value = false
}

// 获取搜索建议
const fetchSuggestions = debounce(async (keyword) => {
  if (!keyword.trim()) {
    suggestions.value = []
    return
  }
  
  try {
    const response = await fetch(currentEngine.value.suggestUrl + encodeURIComponent(keyword))
    const data = await response.json()
    suggestions.value = Array.isArray(data[1]) ? data[1] : []
  } catch (error) {
    console.error('获取搜索建议失败:', error)
    suggestions.value = []
  }
}, 300)

// 选择搜索建议
const selectSuggestion = (suggestion) => {
  searchKeyword.value = suggestion
  handleSearch()
}

// 高亮搜索关键词
const highlightKeyword = (text) => {
  if (!searchKeyword.value) return text
  const regex = new RegExp(`(${searchKeyword.value})`, 'gi')
  return text.replace(regex, '<span class="highlight">$1</span>')
}

// 焦点处理
const handleFocus = () => {
  isFocused.value = true
  showSuggestions.value = true
}

const handleBlur = () => {
  isFocused.value = false
  setTimeout(() => {
    showSuggestions.value = false
  }, 200)
}

// 选择搜索引擎
const selectEngine = (engine) => {
  store.setSearchEngine(engine.value)
  showEngineSelect.value = false
}

// 监听搜索关键词变化
watch(searchKeyword, (newValue) => {
  if (newValue) {
    fetchSuggestions(newValue)
  } else {
    suggestions.value = []
  }
})

// 键盘导航
onKeyStroke(['ArrowDown', 'ArrowUp', 'Enter', 'Escape'], (e) => {
  if (!showSuggestions.value) return

  switch (e.key) {
    case 'ArrowDown':
      e.preventDefault()
      highlightIndex.value = (highlightIndex.value + 1) % suggestions.value.length
      break
    case 'ArrowUp':
      e.preventDefault()
      highlightIndex.value = highlightIndex.value <= 0 ? suggestions.value.length - 1 : highlightIndex.value - 1
      break
    case 'Enter':
      if (highlightIndex.value >= 0) {
        selectSuggestion(suggestions.value[highlightIndex.value])
      }
      break
    case 'Escape':
      showSuggestions.value = false
      break
  }
})
</script>

<style scoped>
.search-container {
  position: relative;
  width: 100%;
  max-width: 650px;
  margin: 0 auto;
}

.search-box {
  position: relative;
  display: flex;
  align-items: center;
  background: rgba(255, 255, 255, 0.12);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  transition: all 0.3s ease;
  overflow: hidden;
  height: 46px;
}

.search-box.is-focused {
  background: rgba(255, 255, 255, 0.16);
  border-color: rgba(255, 255, 255, 0.2);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.engine-selector {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 0 12px;
  height: 100%;
  cursor: pointer;
  transition: all 0.3s ease;
  border-right: 1px solid rgba(255, 255, 255, 0.08);
}

.engine-selector:hover {
  background: rgba(255, 255, 255, 0.08);
}

.engine-icon {
  width: 20px;
  height: 20px;
  border-radius: 4px;
}

.engine-label {
  display: none;  /* 隐藏搜索引擎文字标签 */
}

.arrow-icon {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.7);
  transition: transform 0.3s ease;
}

.engine-selector:hover .arrow-icon {
  transform: rotate(180deg);
}

.search-input {
  flex: 1;
}

.search-input :deep(.el-input__wrapper) {
  background: transparent !important;
  box-shadow: none !important;
  padding: 0 12px;
  height: 46px;
  border: none;
}

.search-input :deep(.el-input__inner) {
  color: rgba(255, 255, 255, 0.9);
  font-size: 14px;
  font-weight: normal;
}

.search-input :deep(.el-input__inner::placeholder) {
  color: rgba(255, 255, 255, 0.5);
  font-size: 14px;
}

.search-input :deep(.el-input__prefix) {
  margin-right: 8px;
}

.search-input :deep(.el-input__prefix-inner) {
  color: rgba(255, 255, 255, 0.7);
}

.suggestions-panel {
  position: absolute;
  top: calc(100% + 8px);
  left: 0;
  right: 0;
  background: rgba(30, 30, 30, 0.95);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
  overflow: hidden;
  z-index: 100;
}

.suggestion-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 16px;
  color: rgba(255, 255, 255, 0.7);
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 14px;
}

.suggestion-item:hover,
.suggestion-item.is-active {
  background: rgba(255, 255, 255, 0.08);
  color: rgba(255, 255, 255, 0.9);
}

.suggestion-item .el-icon {
  color: rgba(255, 255, 255, 0.5);
  font-size: 14px;
}

.highlight {
  color: #409EFF;
  font-weight: 500;
}

/* 搜索引擎选择对话框样式 */
.engine-dialog {
  border-radius: 12px;
  overflow: hidden;
}

.engine-dialog :deep(.el-dialog__header) {
  padding: 16px;
  margin: 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
}

.engine-dialog :deep(.el-dialog__title) {
  font-size: 16px;
  color: rgba(255, 255, 255, 0.9);
}

.engine-dialog :deep(.el-dialog__body) {
  padding: 16px;
}

.engine-list {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.engine-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.engine-item:hover {
  background: rgba(255, 255, 255, 0.08);
}

.engine-item.is-active {
  background: rgba(64, 158, 255, 0.1);
}

.engine-name {
  flex: 1;
  font-size: 14px;
  color: rgba(255, 255, 255, 0.9);
}

.check-icon {
  color: #409EFF;
  font-size: 14px;
}

/* 移动端适配 */
@media (max-width: 768px) {
  .search-container {
    max-width: 92%;
  }

  .search-box {
    height: 42px;
  }

  .engine-selector {
    padding: 0 10px;
  }

  .search-input :deep(.el-input__wrapper) {
    height: 42px;
  }

  .engine-icon {
    width: 18px;
    height: 18px;
  }
}
</style> 