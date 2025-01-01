<template>
  <div class="search-container">
    <!-- 搜索输入框 -->
    <div class="search-input-wrapper" :class="{ 'is-focused': isFocused }">
      <!-- 搜索引擎选择器 -->
      <div class="search-engine" @click="showEngineSelect = true">
        <img :src="currentEngine.icon" :alt="currentEngine.label" class="engine-icon">
        <el-icon class="arrow-icon"><ArrowDown /></el-icon>
      </div>

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

      <!-- 搜索建议 -->
      <transition name="slide-down">
        <div v-if="showSuggestions && suggestions.length" class="suggestions">
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

    <!-- 搜索引擎选择弹窗 -->
    <el-dialog
      v-model="showEngineSelect"
      title="选择搜索引擎"
      width="360px"
      class="engine-dialog"
      align-center
      destroy-on-close
    >
      <div class="engine-list">
        <div
          v-for="engine in searchEngines"
          :key="engine.value"
          class="engine-item"
          :class="{ 'is-active': currentEngine.value === engine.value }"
          @click="selectEngine(engine)"
        >
          <img :src="engine.icon" :alt="engine.label">
          <span>{{ engine.label }}</span>
        </div>
      </div>
    </el-dialog>
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
  max-width: 680px;
  margin: 2rem auto;
  padding: 0 1rem;
}

.search-input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
  background: rgba(255, 255, 255, 0.12);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border-radius: 16px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.search-input-wrapper.is-focused {
  background: rgba(255, 255, 255, 0.15);
  border-color: rgba(255, 255, 255, 0.2);
  box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.1),
              0 4px 12px rgba(0, 0, 0, 0.1);
}

.search-engine {
  position: absolute;
  left: 16px;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 8px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  z-index: 2;
  background: rgba(255, 255, 255, 0.1);
}

.search-engine:hover {
  background: rgba(255, 255, 255, 0.2);
}

.engine-icon {
  width: 20px;
  height: 20px;
  border-radius: 4px;
  object-fit: cover;
}

.arrow-icon {
  font-size: 12px;
  color: var(--text-secondary);
  transition: transform 0.3s ease;
}

.search-engine:hover .arrow-icon {
  transform: rotate(180deg);
}

.search-input {
  flex: 1;
}

.search-input :deep(.el-input__wrapper) {
  background: transparent !important;
  box-shadow: none !important;
  padding: 0 16px 0 88px;
  height: 60px;
}

.search-input :deep(.el-input__inner) {
  color: var(--text-primary);
  font-size: 1.1rem;
  height: 100%;
}

.search-input :deep(.el-input__inner::placeholder) {
  color: var(--text-secondary);
}

.search-input :deep(.el-input__prefix) {
  display: none;
}

.search-input :deep(.el-input__suffix) {
  right: 16px;
}

.search-input :deep(.el-input__clear) {
  color: var(--text-secondary);
  font-size: 16px;
}

/* 搜索建议样式 */
.suggestions {
  position: absolute;
  top: calc(100% + 8px);
  left: 0;
  right: 0;
  background: rgba(30, 30, 30, 0.95);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border-radius: 12px;
  padding: 8px 0;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.1);
  z-index: 10;
}

.suggestion-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  cursor: pointer;
  transition: all 0.2s ease;
  color: var(--text-secondary);
}

.suggestion-item:hover,
.suggestion-item.is-active {
  background: rgba(255, 255, 255, 0.1);
  color: var(--text-primary);
}

.suggestion-item .el-icon {
  font-size: 16px;
}

.highlight {
  color: var(--primary-color);
  font-weight: 500;
}

/* 搜索引擎选择弹窗 */
.engine-dialog :deep(.el-dialog) {
  background: rgba(30, 30, 30, 0.95);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.engine-dialog :deep(.el-dialog__header) {
  padding: 20px 24px;
  margin-right: 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.engine-dialog :deep(.el-dialog__title) {
  color: var(--text-primary);
  font-size: 1.1rem;
}

.engine-dialog :deep(.el-dialog__headerbtn) {
  top: 20px;
  right: 20px;
}

.engine-dialog :deep(.el-dialog__close) {
  color: var(--text-secondary);
}

.engine-list {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  padding: 16px;
}

.engine-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 16px;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
  color: var(--text-secondary);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.engine-item:hover {
  background: rgba(255, 255, 255, 0.1);
  border-color: rgba(255, 255, 255, 0.2);
  color: var(--text-primary);
}

.engine-item.is-active {
  background: var(--primary-color);
  border-color: var(--primary-color);
  color: white;
}

.engine-item img {
  width: 32px;
  height: 32px;
  border-radius: 8px;
}

/* 动画 */
.slide-down-enter-active,
.slide-down-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.slide-down-enter-from,
.slide-down-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}

/* 移动端适配 */
@media (max-width: 768px) {
  .search-container {
    margin: 1rem auto;
  }

  .search-input-wrapper {
    border-radius: 12px;
  }

  .search-input :deep(.el-input__wrapper) {
    height: 50px;
    padding: 0 12px 0 76px;
  }

  .search-engine {
    left: 12px;
    padding: 4px 6px;
  }

  .engine-icon {
    width: 18px;
    height: 18px;
  }

  .search-input :deep(.el-input__inner) {
    font-size: 1rem;
  }

  .engine-list {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style> 