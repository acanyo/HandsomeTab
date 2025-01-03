<template>
  <div class="quick-links-container">
    <div class="quick-links">
      <div v-for="(group, index) in store.quickLinks" :key="index" class="link-group">
        <div class="group-header">
          <h3>{{ group.title }}</h3>
          <div class="group-line"></div>
        </div>
        <div class="links-grid">
          <div
            v-for="link in group.links"
            :key="link.url"
            class="link-card"
            @click="openLink(link.url)"
          >
            <div class="link-icon">
              <img 
                :src="link.icon" 
                :alt="link.name"
                @error="handleIconError(link)"
              >
            </div>
            <span class="link-name">{{ link.name }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useLinksStore } from '../stores/links'
import { getFavicon, DEFAULT_ICON } from '../config/links'

const store = useLinksStore()

const openLink = (url) => {
  window.open(url, '_blank')
}

// 处理图标加载失败
const handleIconError = async (link) => {
  // 如果已经是默认图标就不处理
  if (link.icon === DEFAULT_ICON) return
  
  // 尝试获取网站图标
  link.icon = await getFavicon(link.url)
}
</script>

<style scoped>
.quick-links-container {
  max-height: 45vh;
  overflow-y: auto;
  padding: 0 1.5rem;
  margin-bottom: 2rem;
  scroll-behavior: smooth;
  -webkit-overflow-scrolling: touch;
}

.quick-links {
  max-width: 1200px;
  margin: 0 auto;
}

/* 自定义滚动条 */
.quick-links-container::-webkit-scrollbar {
  width: 4px;
}

.quick-links-container::-webkit-scrollbar-track {
  background: transparent;
}

.quick-links-container::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.3);
  border-radius: 4px;
}

.quick-links-container::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.5);
}

.link-group {
  margin-bottom: 2rem;
}

.link-group:last-child {
  margin-bottom: 1rem;
}

.group-header {
  display: flex;
  align-items: center;
  margin-bottom: 1.2rem;
}

.group-header h3 {
  color: rgba(255, 255, 255, 0.9);
  font-size: 1.1rem;
  font-weight: 500;
  margin-right: 1rem;
  white-space: nowrap;
}

.group-line {
  flex: 1;
  height: 1px;
  background: linear-gradient(
    to right,
    rgba(255, 255, 255, 0.3),
    transparent
  );
}

.links-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(90px, 1fr));
  gap: 0.8rem;
}

.link-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0.8rem;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(8px);
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.link-card:hover {
  transform: translateY(-2px);
  background: rgba(255, 255, 255, 0.15);
  border-color: rgba(255, 255, 255, 0.2);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.link-icon {
  width: 36px;
  height: 36px;
  margin-bottom: 0.6rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.link-icon img {
  width: 100%;
  height: 100%;
  border-radius: 8px;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.link-card:hover .link-icon img {
  transform: scale(1.05);
}

.link-name {
  font-size: 0.85rem;
  color: rgba(255, 255, 255, 0.9);
  text-align: center;
  line-height: 1.2;
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

@media (max-width: 768px) {
  .quick-links-container {
    padding: 0 1rem;
  }

  .links-grid {
    grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));
    gap: 0.6rem;
  }

  .link-card {
    padding: 0.6rem;
  }

  .link-icon {
    width: 32px;
    height: 32px;
  }

  .link-name {
    font-size: 0.8rem;
  }
}
</style> 