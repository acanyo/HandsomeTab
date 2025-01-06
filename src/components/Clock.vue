<template>
  <div class="clock">
    <div class="time">{{ time }}</div>
    <div class="date">{{ date }}</div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const time = ref('')
const date = ref('')
let timer = null

const updateTime = () => {
  const now = new Date()
  time.value = now.toLocaleTimeString('zh-CN', { 
    hour: '2-digit', 
    minute: '2-digit',
    hour12: false
  })
  
  // 格式化日期
  const dateStr = now.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    weekday: 'long'
  })
  date.value = dateStr.replace(/年|月/g, '-').replace('日', '')
}

onMounted(() => {
  updateTime()
  timer = setInterval(updateTime, 1000)
})

onUnmounted(() => {
  if (timer) clearInterval(timer)
})
</script>

<style scoped>
.clock {
  text-align: center;
  color: rgba(255, 255, 255, 0.95);
  text-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
  user-select: none;
}

.time {
  font-size: 5rem;
  font-weight: 200;
  letter-spacing: 2px;
  line-height: 1.2;
  margin-bottom: 0.5rem;
}

.date {
  font-size: 1.2rem;
  font-weight: 300;
  opacity: 0.9;
  letter-spacing: 1px;
}

/* 移动端适配 */
@media (max-width: 768px) {
  .time {
    font-size: 4rem;
  }

  .date {
    font-size: 1rem;
  }
}
</style> 