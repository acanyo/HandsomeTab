<template>
  <div class="notes">
    <!-- 笔记列表 -->
    <div class="notes-list">
      <div class="notes-header">
        <h3>我的笔记</h3>
        <el-button type="primary" @click="createNote">新建笔记</el-button>
      </div>
      
      <el-scrollbar height="calc(100vh - 200px)">
        <div
          v-for="note in store.notes"
          :key="note.id"
          class="note-item"
          :class="{ active: currentNote?.id === note.id }"
          @click="selectNote(note)"
        >
          <div class="note-title">{{ note.title || '未命名笔记' }}</div>
          <div class="note-meta">
            <span>{{ formatDate(note.updatedAt) }}</span>
            <el-button
              type="danger"
              link
              @click.stop="deleteNote(note)"
            >
              删除
            </el-button>
          </div>
        </div>
      </el-scrollbar>
    </div>

    <!-- 笔记编辑器 -->
    <div class="note-editor" v-if="currentNote">
      <el-input
        v-model="currentNote.title"
        placeholder="笔记标题"
        class="title-input"
        @change="saveNote"
      />
      <el-input
        v-model="currentNote.content"
        type="textarea"
        placeholder="开始写笔记..."
        :rows="15"
        resize="none"
        @input="autoSave"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useNotesStore } from '../stores/notes'
import { debounce } from 'lodash-es'

const store = useNotesStore()
const currentNote = ref(null)

// 自动保存（防抖）
const autoSave = debounce(() => {
  if (currentNote.value) {
    saveNote()
  }
}, 1000)

// 创建新笔记
const createNote = () => {
  const note = store.createNote()
  currentNote.value = note
}

// 选择笔记
const selectNote = (note) => {
  currentNote.value = { ...note }
}

// 保存笔记
const saveNote = () => {
  if (currentNote.value) {
    currentNote.value.updatedAt = new Date()
    store.updateNote(currentNote.value)
  }
}

// 删除笔记
const deleteNote = async (note) => {
  try {
    await ElMessageBox.confirm('确定要删除这条笔记吗？', '提示', {
      type: 'warning'
    })
    store.deleteNote(note.id)
    if (currentNote.value?.id === note.id) {
      currentNote.value = null
    }
  } catch {}
}

// 格式化日期
const formatDate = (date) => {
  return new Date(date).toLocaleString('zh-CN', {
    month: 'numeric',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}
</script>

<style scoped>
.notes {
  display: flex;
  height: calc(100vh - 100px);
}

.notes-list {
  width: 250px;
  border-right: 1px solid #eee;
  padding: 1rem;
}

.notes-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.note-item {
  padding: 0.8rem;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s;
  margin-bottom: 0.5rem;
}

.note-item:hover {
  background-color: #f5f7fa;
}

.note-item.active {
  background-color: #ecf5ff;
}

.note-title {
  font-weight: 500;
  margin-bottom: 0.5rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.note-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.8rem;
  color: #909399;
}

.note-editor {
  flex: 1;
  padding: 1rem;
}

.title-input {
  margin-bottom: 1rem;
}

:deep(.el-textarea__inner) {
  font-family: 'Segoe UI', system-ui, sans-serif;
  line-height: 1.6;
}
</style> 