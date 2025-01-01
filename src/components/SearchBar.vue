<template>
  <div class="search-container">
    <div class="search-box" :class="{ 'is-focused': isFocused }">
      <!-- 搜索引擎选择器 -->
      <div class="engine-selector" @click="showEngineSelect = true">
        <img :src="currentEngine.icon" :alt="currentEngine.label" class="engine-icon">
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
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { Search, ArrowDown } from '@element-plus/icons-vue'
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
    label: 'Google',
    value: 'google',
    icon: 'https://www.google.com/favicon.ico',
    searchUrl: 'https://www.google.com/search?q=',
    suggestUrl: 'https://suggestqueries.google.com/complete/search?client=chrome&q='
  },
  {
    label: '百度',
    value: 'baidu',
    icon: 'https://www.baidu.com/favicon.ico',
    searchUrl: 'https://www.baidu.com/s?wd=',
    suggestUrl: 'https://suggestion.baidu.com/su?wd='
  },
  {
    label: '必应',
    value: 'bing',
    icon: 'https://www.bing.com/favicon.ico',
    searchUrl: 'https://www.bing.com/search?q=',
    suggestUrl: 'https://api.bing.com/qsonhs.aspx?q='
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
}

.search-box {
  position: relative;
  display: flex;
  align-items: center;
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-radius: 24px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  overflow: hidden;
}

.search-box.is-focused {
  background: rgba(255, 255, 255, 0.2);
  border-color: rgba(255, 255, 255, 0.3);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.engine-selector {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 12px;
  margin-left: 8px;
  border-radius: 16px;
  cursor: pointer;
  transition: all 0.3s ease;
  background: rgba(255, 255, 255, 0.1);
}

.engine-selector:hover {
  background: rgba(255, 255, 255, 0.2);
}

.engine-icon {
  width: 20px;
  height: 20px;
  border-radius: 4px;
}

.arrow-icon {
  font-size: 12px;
  color: var(--text-secondary);
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
  padding: 0 16px;
  height: 56px;
}

.search-input :deep(.el-input__inner) {
  color: var(--text-primary);
  font-size: 1.1rem;
  padding-left: 8px;
}

.search-input :deep(.el-input__inner::placeholder) {
  color: var(--text-secondary);
}

.suggestions-panel {
  position: absolute;
  top: calc(100% + 12px);
  left: 0;
  right: 0;
  background: rgba(28, 28, 28, 0.95);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
  overflow: hidden;
  z-index: 100;
}

.suggestion-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  color: var(--text-secondary);
  cursor: pointer;
  transition: all 0.2s ease;
}

.suggestion-item:hover,
.suggestion-item.is-active {
  background: rgba(255, 255, 255, 0.1);
  color: var(--text-primary);
}

.suggestion-item .el-icon {
  color: var(--text-secondary);
  font-size: 16px;
}

.highlight {
  color: var(--primary-color);
  font-weight: 500;
}

/* 动画效果 */
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.fade-slide-enter-from,
.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}

/* 移动端适配 */
@media (max-width: 768px) {
  .search-box {
    border-radius: 20px;
  }

  .engine-selector {
    padding: 6px 10px;
    margin-left: 6px;
  }

  .search-input :deep(.el-input__wrapper) {
    height: 48px;
  }

  .search-input :deep(.el-input__inner) {
    font-size: 1rem;
  }
}
</style> 