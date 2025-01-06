<template>
  <div class="daily-quote" @mouseenter="showActions = true" @mouseleave="showActions = false">
    <div class="quote-wrapper">
      <span class="quote-mark">「</span>
      <span class="quote-content">{{ quote }}</span>
      <span class="quote-mark">」</span>
      <transition name="fade">
        <div v-if="showActions" class="quote-actions">
          <span v-if="author" class="quote-author">- {{ author }}</span>
          <el-icon class="action-icon" @click="copyQuote"><CopyDocument /></el-icon>
          <el-icon class="action-icon" @click="fetchQuote"><RefreshRight /></el-icon>
        </div>
      </transition>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { CopyDocument, RefreshRight } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import axios from 'axios'

const quote = ref('')
const author = ref('')
const showActions = ref(false)

const fetchQuote = async () => {
  try {
    const response = await axios.get('https://v1.hitokoto.cn/')
    quote.value = response.data.hitokoto
    author.value = response.data.from_who || response.data.from
  } catch (error) {
    console.error('获取每日一句失败:', error)
    quote.value = '生活明朗，万物可爱'
    author.value = '匿名'
  }
}

const copyQuote = async () => {
  try {
    const textToCopy = `「${quote.value}」 - ${author.value}`
    await navigator.clipboard.writeText(textToCopy)
    ElMessage.success('复制成功')
  } catch (error) {
    console.error('复制失败:', error)
    ElMessage.error('复制失败')
  }
}

onMounted(() => {
  fetchQuote()
})
</script>

<style scoped>
.daily-quote {
  padding: 12px 24px;
  text-align: center;
  color: rgba(255, 255, 255, 0.95);
  font-size: 14px;
  line-height: 1.5;
  letter-spacing: 0.5px;
  width: 100%;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
}

.quote-wrapper {
  position: relative;
  display: inline-flex;
  align-items: center;
  gap: 4px;
}

.quote-mark {
  font-size: 15px;
  opacity: 0.8;
}

.quote-content {
  margin: 0;
  font-weight: 400;
}

.quote-actions {
  display: inline-flex;
  align-items: center;
  gap: 12px;
  margin-left: 16px;
}

.quote-author {
  font-size: 13px;
  opacity: 0.8;
}

.action-icon {
  cursor: pointer;
  font-size: 15px;
  opacity: 0.8;
  transition: opacity 0.2s ease;
}

.action-icon:hover {
  opacity: 1;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

@media (max-width: 768px) {
  .daily-quote {
    padding: 10px 16px;
    font-size: 13px;
  }

  .quote-mark {
    font-size: 14px;
  }

  .quote-actions {
    margin-left: 12px;
    gap: 10px;
  }

  .quote-author {
    font-size: 12px;
  }

  .action-icon {
    font-size: 14px;
  }
}
</style> 