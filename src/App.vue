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
        '%c HandsomeTab %c v1.0.0 ',
        'background:#35495e ; padding: 1px; border-radius: 3px 0 0 3px;  color: #fff',
        'background:#41b883 ; padding: 1px; border-radius: 0 3px 3px 0;  color: #fff',
      )
    }, 1000)
  }
})
</script>