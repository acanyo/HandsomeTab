<template>
  <div class="weather-widget">
    <div v-if="weather" class="weather-info">
      <div class="left-section">
        <span class="city">{{ weather.city }}</span>
        <el-icon class="location-icon"><Location /></el-icon>
      </div>
      <div class="right-section">
        <div class="temperature-row">
          <span class="temperature">{{ weather.temperature }}</span>
        </div>
        <div class="weather-extra">
          <el-icon class="weather-icon">
            <component :is="getWeatherIcon(weather.weather)" />
          </el-icon>
          <span class="weather-desc">{{ weather.weather }}</span>
          <span class="temp-range">最低 {{ weather.tempn }}° 最高 {{ weather.temp }}°</span>
        </div>
      </div>
    </div>
    <div v-else-if="error" class="weather-error">
      <el-tooltip :content="error" placement="bottom">
        <el-icon><Warning /></el-icon>
      </el-tooltip>
    </div>
    <div v-else class="weather-loading">
      <el-icon class="is-loading"><Loading /></el-icon>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { 
  Sunny, Cloudy, Lightning, Moon, 
  Loading, Warning, Location
} from '@element-plus/icons-vue'
import { weatherService } from '../services/weatherService'
import { locationService } from '../services/locationService'

const weather = ref(null)
const error = ref(null)

// 获取天气信息
const fetchWeather = async (city) => {
  try {
    weather.value = null
    error.value = null
    const data = await weatherService.getWeather(city)
    weather.value = data
  } catch (err) {
    error.value = err.message
    console.error('获取天气失败:', err)
  }
}

// 根据天气状况返回对应图标
const getWeatherIcon = (weather) => {
  if (!weather) return Sunny
  if (weather.includes('晴')) return Sunny
  if (weather.includes('云') || weather.includes('阴')) return Cloudy
  if (weather.includes('雨') || weather.includes('雪')) return Lightning
  if (weather.includes('夜')) return Moon
  return Sunny
}

// 定时更新天气的计时器
let updateTimer = null

onMounted(async () => {
  try {
    // 获取位置信息
    const locationInfo = await locationService.getIpLocation()
    console.log('获取到位置信息:', locationInfo)
    
    if (locationInfo && locationInfo.city) {
      const city = locationInfo.city.replace('市', '')
      await fetchWeather(city)
      localStorage.setItem('weatherCity', city)
    } else {
      const savedCity = localStorage.getItem('weatherCity') || '北京'
      await fetchWeather(savedCity)
    }
  } catch (err) {
    console.error('自动定位失败:', err)
    const savedCity = localStorage.getItem('weatherCity') || '北京'
    await fetchWeather(savedCity)
  }

  // 设置定时更新（每30分钟更新一次）
  updateTimer = setInterval(async () => {
    const currentCity = weather.value?.city || localStorage.getItem('weatherCity') || '北京'
    await fetchWeather(currentCity)
  }, 30 * 60 * 1000)
})

onUnmounted(() => {
  if (updateTimer) {
    clearInterval(updateTimer)
  }
})
</script>

<style scoped>
.weather-widget {
  display: inline-flex;
  align-items: center;
  padding: 8px 12px;
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(12px);
  border-radius: 16px;
  min-width: 200px;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.weather-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  gap: 12px;
}

.left-section {
  display: flex;
  align-items: center;
  gap: 4px;
}

.city {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.9);
  font-weight: normal;
}

.location-icon {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.6);
}

.right-section {
  text-align: right;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.temperature-row {
  margin-bottom: 0;
}

.temperature {
  font-size: 20px;
  font-weight: normal;
  color: rgba(255, 255, 255, 0.9);
  line-height: 1;
}

.weather-extra {
  display: flex;
  align-items: center;
  gap: 4px;
  color: rgba(255, 255, 255, 0.6);
  font-size: 12px;
}

.weather-icon {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.8);
}

.weather-desc {
  margin-right: 2px;
}

.temp-range {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.6);
}

.weather-error,
.weather-loading {
  padding: 6px;
  color: rgba(255, 255, 255, 0.6);
}

.is-loading {
  animation: rotate 1s linear infinite;
}

@keyframes rotate {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
</style> 