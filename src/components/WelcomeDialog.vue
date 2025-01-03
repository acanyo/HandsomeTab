<template>
  <el-dialog
    v-model="showDialog"
    :title="welcomeTitle"
    width="400px"
    :show-close="true"
    :close-on-click-modal="true"
    class="welcome-dialog"
  >
    <div class="welcome-content">
      <div class="greeting">{{ welcome.greeting }}</div>
      <div class="message">{{ welcome.message }}</div>
      <div class="location-info" v-if="locationInfo">
        <el-divider>位置信息</el-divider>
        <p>{{ locationInfo }}</p>
        <p v-if="ipInfo" class="ip-info">IP: {{ ipInfo }}</p>
      </div>
    </div>
    <template #footer>
      <div class="dialog-footer">
        <el-checkbox v-model="noRemind" class="remind-checkbox">一小时内不再提醒</el-checkbox>
        <el-button type="primary" @click="handleClose">
          确定
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  welcome: {
    type: Object,
    required: true
  },
  location: {
    type: Object,
    required: true
  }
})

const showDialog = ref(true)
const noRemind = ref(false)

// 计算标题
const welcomeTitle = computed(() => {
  const hour = new Date().getHours()
  if (hour >= 5 && hour < 12) return '早安'
  if (hour >= 12 && hour < 18) return '午安'
  return '晚安'
})

// 格式化位置信息
const locationInfo = computed(() => {
  const { province, city, district } = props.location
  return [province, city, district].filter(Boolean).join(' ')
})

// 处理 IPv6
const ipInfo = computed(() => {
  const ip = props.location.ip
  return ip?.includes(':') ? 'IPv6地址' : ip
})

// 处理关闭
const handleClose = () => {
  if (noRemind.value) {
    // 保存时间戳到本地存储
    const expireTime = Date.now() + 60 * 60 * 1000 // 1小时
    localStorage.setItem('welcomeExpireTime', expireTime.toString())
  }
  showDialog.value = false
}
</script>

<style scoped>
.welcome-dialog :deep(.el-dialog__header) {
  text-align: center;
  margin-right: 0;
  padding: 20px;
}

.welcome-content {
  text-align: center;
  padding: 0 20px;
}

.greeting {
  font-size: 1.2em;
  color: #409EFF;
  margin-bottom: 15px;
}

.message {
  font-size: 1.1em;
  color: #303133;
  margin-bottom: 20px;
}

.location-info {
  color: #606266;
  font-size: 0.9em;
}

.ip-info {
  color: #909399;
  font-size: 0.8em;
}

.dialog-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
}

.remind-checkbox {
  color: #606266;
}
</style> 