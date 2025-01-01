<template>
  <div class="weather-widget">
    <!-- 简略天气信息 -->
    <div class="weather-brief" @click="showDetail = true">
      <template v-if="weather">
        <div class="weather-icon">
          <el-icon><Sunny /></el-icon>
        </div>
        <div class="weather-info">
          <div class="temperature">{{ weather.temp }}°</div>
          <div class="location">{{ weather.city }}</div>
        </div>
      </template>
      <el-skeleton v-else animated :rows="2" />
    </div>

    <!-- 天气详情弹窗 -->
    <el-dialog
      v-model="showDetail"
      title="天气详情"
      width="400px"
      class="weather-dialog"
      align-center
    >
      <div class="weather-detail">
        <div class="current-weather">
          <div class="main-info">
            <div class="temp-info">
              <div class="current-temp">{{ weather?.temp }}°</div>
              <div class="weather-desc">{{ weather?.text }}</div>
            </div>
            <div class="weather-icon large">
              <el-icon><Sunny /></el-icon>
            </div>
          </div>
          <div class="weather-stats">
            <div class="stat-item">
              <el-icon><Cloudy /></el-icon>
              <span>湿度 {{ weather?.humidity }}%</span>
            </div>
            <div class="stat-item">
              <el-icon><Umbrella /></el-icon>
              <span>降水 {{ weather?.precipitation }}%</span>
            </div>
            <div class="stat-item">
              <el-icon><WindPower /></el-icon>
              <span>{{ weather?.windDir }} {{ weather?.windScale }}级</span>
            </div>
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { Sunny, Cloudy, Umbrella, WindPower } from '@element-plus/icons-vue'

const weather = ref({
  temp: 25,
  text: '晴',
  humidity: 65,
  precipitation: 0,
  windDir: '东南风',
  windScale: 3,
  city: '北京市'
})

const showDetail = ref(false)
</script>

<style scoped>
.weather-widget {
  position: relative;
}

.weather-brief {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.5rem 1rem;
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
  border-radius: 50px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.weather-brief:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: translateY(-2px);
}

.weather-icon {
  font-size: 2rem;
  color: #ffd700;
}

.weather-icon.large {
  font-size: 4rem;
}

.weather-info {
  line-height: 1.2;
}

.temperature {
  font-size: 1.5rem;
  font-weight: 500;
}

.location {
  font-size: 0.9rem;
  opacity: 0.9;
}

/* 天气详情样式 */
.weather-dialog :deep(.el-dialog__body) {
  padding: 0;
}

.weather-detail {
  padding: 1.5rem;
}

.current-weather {
  text-align: center;
}

.main-info {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 2rem;
  margin-bottom: 2rem;
}

.current-temp {
  font-size: 3rem;
  font-weight: 300;
  line-height: 1;
  margin-bottom: 0.5rem;
}

.weather-desc {
  font-size: 1.2rem;
  color: #666;
}

.weather-stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
  padding: 1rem;
  background: #f5f7fa;
  border-radius: 8px;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  color: #666;
}

.stat-item .el-icon {
  font-size: 1.5rem;
  color: #409eff;
}

/* 动画效果 */
.weather-brief {
  animation: slideIn 0.5s ease;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateX(-20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}
</style> 