<template>
  <div class="weather-widget" @click="showWeatherDetail = true">
    <!-- 简要天气信息 -->
    <div v-if="weather" class="weather-info">
      <div class="weather-main">
        <el-icon class="weather-icon">
          <component :is="getWeatherIcon(weather.weather)" />
        </el-icon>
        <span class="temperature">{{ weather.temperature }}</span>
      </div>
      <div class="weather-details">
        <span class="city">{{ weather.city }}</span>
        <span class="condition">{{ weather.weather }}</span>
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

    <!-- 天气详情弹窗 -->
    <el-dialog
      v-model="showWeatherDetail"
      :title="`${weather?.city || ''}天气详情`"
      width="360px"
      destroy-on-close
    >
      <div v-if="weather" class="weather-detail-content">
        <div class="weather-header">
          <div class="weather-icon-large">
            <el-icon :size="48">
              <component :is="getWeatherIcon(weather.weather)" />
            </el-icon>
          </div>
          <div class="weather-temp-large">{{ weather.temperature }}</div>
          <div class="weather-desc">{{ weather.weather }}</div>
        </div>
        
        <el-divider />
        
        <div class="weather-info-grid">
          <div class="info-item">
            <el-icon><WindPower /></el-icon>
            <span class="label">风况</span>
            <span class="value">{{ weather.wind }} {{ weather.windspeed }}</span>
          </div>
          <div class="info-item">
            <el-icon><Histogram /></el-icon>
            <span class="label">湿度</span>
            <span class="value">{{ weather.humidity }}</span>
          </div>
          <div class="info-item">
            <el-icon><View /></el-icon>
            <span class="label">能见度</span>
            <span class="value">{{ weather.visibility }}</span>
          </div>
          <div class="info-item">
            <el-icon><Monitor /></el-icon>
            <span class="label">空气质量</span>
            <span class="value">AQI: {{ weather.air }}</span>
          </div>
        </div>

        <div class="update-time">
          更新时间：{{ weather.time }}
        </div>
      </div>

      <template #footer>
        <div class="dialog-footer">
          <el-button @click="handleRefreshWeather" type="primary">
            <el-icon><Refresh /></el-icon>
            刷新
          </el-button>
          <el-button @click="showCityDialog = true" type="primary" plain>
            <el-icon><Location /></el-icon>
            切换城市
          </el-button>
        </div>
      </template>
    </el-dialog>

    <!-- 设置城市对话框 -->
    <el-dialog
      v-model="showCityDialog"
      title="设置城市"
      width="300px"
      append-to-body
    >
      <el-form @submit.prevent="handleSetCity">
        <el-form-item>
          <el-input
            v-model="cityInput"
            placeholder="请输入城市名称（如：北京）"
            clearable
            @keyup.enter="handleSetCity"
          >
            <template #append>
              <el-button @click="handleSetCity">确定</el-button>
            </template>
          </el-input>
        </el-form-item>
        <div class="location-action">
          <el-button 
            type="primary" 
            link 
            :loading="locating"
            @click="handleAutoLocation"
          >
            <el-icon><Location /></el-icon>
            自动定位
          </el-button>
        </div>
      </el-form>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { 
  Sunny, Cloudy, Lightning, Moon, 
  Loading, Warning, Location, 
  WindPower, Histogram, View, Monitor,
  Refresh
} from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { weatherService } from '../services/weatherService'
import { locationService } from '../services/locationService'

const weather = ref(null)
const error = ref(null)
const showCityDialog = ref(false)
const cityInput = ref('')
const locating = ref(false)
const showWelcome = ref(false)
const welcomeMessage = ref(null)
const locationInfo = ref(null)
const showWeatherDetail = ref(false)

// 定时更新天气的计时器
let updateTimer = null

// 获取天气信息
const fetchWeather = async (city) => {
  try {
    weather.value = null // 清空当前天气数据
    error.value = null
    const data = await weatherService.getWeather(city)
    weather.value = data
  } catch (err) {
    error.value = err.message
    ElMessage.error(err.message)
  }
}

// 设置城市
const handleSetCity = async () => {
  if (!cityInput.value) {
    ElMessage.warning('请输入城市名称')
    return
  }
  
  // 去除城市名中的"市"字后缀
  const cityName = cityInput.value.trim().replace(/市$/, '')
  
  try {
    await fetchWeather(cityName)
    if (!error.value) {
      localStorage.setItem('weatherCity', cityName)
      showCityDialog.value = false
      cityInput.value = ''
    }
  } catch (err) {
    ElMessage.error(err.message)
  }
}

// 检查是否应该显示欢迎信息
const shouldShowWelcome = () => {
  const expireTime = localStorage.getItem('welcomeExpireTime')
  if (!expireTime) return true
  return Date.now() > parseInt(expireTime)
}

// 设置下次显示时间
const setWelcomeExpireTime = () => {
  const expireTime = Date.now() + 60 * 60 * 1000 // 1小时后
  localStorage.setItem('welcomeExpireTime', expireTime.toString())
}

// 显示欢迎消息
const showWelcomeMessage = (locationInfo) => {
  if (shouldShowWelcome()) {
    const welcome = locationService.getWelcomeMessage(locationInfo)
    ElMessage({
      message: `${welcome.greeting}，${welcome.message}`,
      type: 'success',
      duration: 5000,
      showClose: true
    })
    setWelcomeExpireTime()
  }
}

// 自动定位
const handleAutoLocation = async () => {
  try {
    locating.value = true
    const locationInfo = await locationService.getIpLocation()
    const city = locationInfo.city.replace('市', '')
    await fetchWeather(city)
    
    if (!error.value) {
      localStorage.setItem('weatherCity', city)
      showWelcomeMessage(locationInfo)
      showCityDialog.value = false
    }
  } catch (err) {
    ElMessage.error(err.message)
  } finally {
    locating.value = false
  }
}

// 刷新天气
const handleRefreshWeather = async () => {
  const city = weather.value?.city || localStorage.getItem('weatherCity') || '北京'
  await fetchWeather(city)
  ElMessage.success('天气已更新')
}

onMounted(async () => {
  try {
    locating.value = true
    const locationInfo = await locationService.getIpLocation()
    console.log('获取到位置信息:', locationInfo)
    
    if (locationInfo && locationInfo.city) {
      const city = locationInfo.city.replace('市', '')
      await fetchWeather(city)
      localStorage.setItem('weatherCity', city)
      showWelcomeMessage(locationInfo)
    } else {
      const savedCity = localStorage.getItem('weatherCity') || '北京'
      await fetchWeather(savedCity)
    }
  } catch (err) {
    console.error('自动定位失败:', err)
    const savedCity = localStorage.getItem('weatherCity') || '北京'
    await fetchWeather(savedCity)
  } finally {
    locating.value = false
  }

  // 设置定时更新
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

// 根据天气状况返回对应图标
const getWeatherIcon = (weather) => {
  if (!weather) return Sunny
  if (weather.includes('晴')) return Sunny
  if (weather.includes('云') || weather.includes('阴')) return Cloudy
  if (weather.includes('雨') || weather.includes('雪')) return Lightning
  if (weather.includes('夜')) return Moon
  return Sunny
}
</script>

<style scoped>
.weather-widget {
  display: inline-flex;
  align-items: center;
  padding: 8px 16px;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(8px);
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  min-width: 120px;
}

.weather-widget:hover {
  background: rgba(255, 255, 255, 0.2);
}

.weather-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.weather-main {
  display: flex;
  align-items: center;
  gap: 8px;
}

.weather-icon {
  font-size: 24px;
  color: #fff;
}

.temperature {
  font-size: 20px;
  font-weight: 500;
  color: #fff;
}

.weather-details {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.city {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.9);
}

.condition {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.7);
}

.weather-error,
.weather-loading {
  padding: 0.5rem;
  color: rgba(255, 255, 255, 0.7);
}

.is-loading {
  animation: rotate 1s linear infinite;
}

@keyframes rotate {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.location-action {
  margin-top: 1rem;
  text-align: center;
}

.weather-dialog {
  --el-dialog-padding-primary: 20px;
}

.weather-detail-content {
  padding: 20px 0;
}

.weather-header {
  text-align: center;
  margin-bottom: 20px;
}

.weather-icon-large {
  margin-bottom: 10px;
  color: var(--el-color-primary);
}

.weather-temp-large {
  font-size: 36px;
  font-weight: 500;
  color: var(--el-text-color-primary);
  margin-bottom: 5px;
}

.weather-desc {
  font-size: 16px;
  color: var(--el-text-color-regular);
}

.weather-info-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
  padding: 0 20px;
}

.info-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 15px;
  background: var(--el-fill-color-light);
  border-radius: 8px;
}

.info-item .el-icon {
  font-size: 24px;
  color: var(--el-color-primary);
}

.info-item .label {
  font-size: 14px;
  color: var(--el-text-color-secondary);
}

.info-item .value {
  font-size: 16px;
  color: var(--el-text-color-primary);
}

.update-time {
  text-align: center;
  margin-top: 20px;
  font-size: 12px;
  color: var(--el-text-color-secondary);
}

.dialog-footer {
  display: flex;
  justify-content: center;
  gap: 16px;
}

/* 适配深色模式 */
:root[data-theme='dark'] .info-item {
  background: var(--el-bg-color-overlay);
}
</style> 