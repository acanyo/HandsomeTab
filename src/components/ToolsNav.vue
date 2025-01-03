<template>
  <nav class="tools-nav">
    <div class="tools-container">
      <!-- 天气组件 -->
      <Weather />
      
      <!-- 设置按钮 -->
      <el-button
        class="settings-btn"
        type="primary"
        link
        @click="showSettings = true"
      >
        <el-icon><Setting /></el-icon>
      </el-button>
    </div>

    <!-- 设置对话框 -->
    <Settings
      v-model:visible="showSettings"
      @update:visible="showSettings = $event"
    />
  </nav>
</template>

<script setup>
import { ref } from 'vue'
import { Setting } from '@element-plus/icons-vue'
import Weather from './Weather.vue'
import Settings from './Settings.vue'

const showSettings = ref(false)
</script>

<style scoped>
.tools-nav {
  position: fixed;
  top: 1rem;
  right: 1rem;
  z-index: 100;
}

.tools-container {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.settings-btn {
  padding: 0.5rem;
  color: #fff;
  transition: all 0.3s ease;
}

.settings-btn:hover {
  transform: rotate(45deg);
}
</style> 