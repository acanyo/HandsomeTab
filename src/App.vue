<template>
  <router-view></router-view>
</template>

<script setup>
import { onMounted } from 'vue'

onMounted(() => {
  // 只在生产环境清空控制台
  if (import.meta.env.PROD) {
    setTimeout(() => {
      console.clear()
      // 添加一个友好的提示
      console.log(
        '%c 👋 欢迎使用 HandsomeTab！',
        'color: #409EFF; font-size: 14px; font-weight: bold; padding: 8px 0;'
      )
      console.log(
        '%c 这是一个精心打造的新标签页扩展，希望能为您的浏览体验带来一份优雅与便利。',
        'color: #67C23A; font-size: 12px; padding: 4px 0;'
      )
      console.log(
        '%c 如果您觉得这个项目不错，欢迎给个 Star ⭐️',
        'color: #E6A23C; font-size: 12px; padding: 4px 0;'
      )
      console.log(
        '%c 🌐 官网：https://www.lik.cc',
        'color: #909399; font-size: 12px; padding: 4px 0;'
      )
      console.log(
        '%c ✨ 在线演示：https://tab.lik.cc',
        'color: #909399; font-size: 12px; padding: 4px 0;'
      )
    }, 1000)
  }
})
</script>