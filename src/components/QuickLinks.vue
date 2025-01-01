<template>
  <div class="quick-links">
    <div v-for="(group, index) in store.quickLinks" :key="index" class="link-group">
      <h3>{{ group.title }}</h3>
      <div class="links-grid">
        <div
          v-for="link in group.links"
          :key="link.url"
          class="link-card"
          @click="openLink(link.url)"
        >
          <img :src="link.icon" :alt="link.name">
          <span>{{ link.name }}</span>
        </div>
        <div class="link-card add-link" @click="showAddLinkDialog(group)">
          <el-icon><Plus /></el-icon>
          <span>添加</span>
        </div>
      </div>
    </div>

    <el-dialog
      v-model="dialogVisible"
      title="添加快捷方式"
      width="400px"
    >
      <el-form :model="newLink" label-width="80px">
        <el-form-item label="名称">
          <el-input v-model="newLink.name" />
        </el-form-item>
        <el-form-item label="网址">
          <el-input v-model="newLink.url" />
        </el-form-item>
        <el-form-item label="图标">
          <el-input v-model="newLink.icon" placeholder="输入图标URL或自动获取" />
        </el-form-item>
        <el-form-item label="分组">
          <el-select v-model="newLink.group" style="width: 100%">
            <el-option
              v-for="group in store.quickLinks"
              :key="group.title"
              :label="group.title"
              :value="group.title"
            />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="addNewLink">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { Plus } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { useLinksStore } from '../stores/links'

const store = useLinksStore()

const dialogVisible = ref(false)
const currentGroup = ref(null)
const newLink = reactive({
  name: '',
  url: '',
  icon: '',
  group: ''
})

const showAddLinkDialog = (group) => {
  currentGroup = group
  newLink.group = group.title
  dialogVisible.value = true
}

const addNewLink = () => {
  if (!newLink.name || !newLink.url) {
    ElMessage.warning('请填写名称和网址')
    return
  }

  if (!newLink.icon) {
    const url = new URL(newLink.url)
    newLink.icon = `${url.origin}/favicon.ico`
  }

  store.addLink(newLink.group, {
    name: newLink.name,
    url: newLink.url,
    icon: newLink.icon
  })

  dialogVisible.value = false
  ElMessage.success('添加成功')
  
  newLink.name = ''
  newLink.url = ''
  newLink.icon = ''
}

const openLink = (url) => {
  window.open(url, '_blank')
}
</script>

<style scoped>
.quick-links {
  margin-top: 3rem;
}

.link-group {
  margin-bottom: 2rem;
}

.link-group h3 {
  margin-bottom: 1rem;
  color: #333;
  font-size: 1.2rem;
}

.links-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
  gap: 1rem;
}

.link-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1rem;
  background: #f5f7fa;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.link-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.link-card img {
  width: 32px;
  height: 32px;
  margin-bottom: 0.5rem;
}

.link-card span {
  font-size: 0.9rem;
  color: #606266;
}

.add-link {
  border: 2px dashed #dcdfe6;
  background: transparent;
}

.add-link .el-icon {
  font-size: 24px;
  color: #909399;
  margin-bottom: 0.5rem;
}
</style> 