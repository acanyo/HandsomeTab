<template>
  <div class="todo-list">
    <el-input
      v-model="newTodo"
      placeholder="添加新待办..."
      @keyup.enter="addTodo"
    >
      <template #append>
        <el-button @click="addTodo">添加</el-button>
      </template>
    </el-input>

    <el-tabs v-model="activeTab" class="todo-tabs">
      <el-tab-pane label="待办" name="todo">
        <el-empty v-if="activeTodos.length === 0" description="暂无待办" />
        <TransitionGroup name="list">
          <div
            v-for="todo in activeTodos"
            :key="todo.id"
            class="todo-item"
          >
            <el-checkbox
              v-model="todo.completed"
              @change="toggleTodo(todo)"
            >
              {{ todo.text }}
            </el-checkbox>
            <el-button
              type="danger"
              link
              @click="removeTodo(todo)"
            >
              删除
            </el-button>
          </div>
        </TransitionGroup>
      </el-tab-pane>

      <el-tab-pane label="已完成" name="completed">
        <el-empty v-if="completedTodos.length === 0" description="暂无已完成项目" />
        <TransitionGroup name="list">
          <div
            v-for="todo in completedTodos"
            :key="todo.id"
            class="todo-item completed"
          >
            <el-checkbox
              v-model="todo.completed"
              @change="toggleTodo(todo)"
            >
              {{ todo.text }}
            </el-checkbox>
            <el-button
              type="danger"
              link
              @click="removeTodo(todo)"
            >
              删除
            </el-button>
          </div>
        </TransitionGroup>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useTodoStore } from '../stores/todo'

const store = useTodoStore()
const newTodo = ref('')
const activeTab = ref('todo')

const activeTodos = computed(() => store.todos.filter(todo => !todo.completed))
const completedTodos = computed(() => store.todos.filter(todo => todo.completed))

const addTodo = () => {
  if (newTodo.value.trim()) {
    store.addTodo(newTodo.value)
    newTodo.value = ''
  }
}

const toggleTodo = (todo) => {
  store.toggleTodo(todo.id)
}

const removeTodo = (todo) => {
  store.removeTodo(todo.id)
}
</script>

<style scoped>
.todo-list {
  padding: 1rem;
}

.todo-tabs {
  margin-top: 1rem;
}

.todo-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem;
  border-bottom: 1px solid #eee;
}

.todo-item.completed {
  opacity: 0.6;
}

.todo-item.completed :deep(.el-checkbox__label) {
  text-decoration: line-through;
}

.list-enter-active,
.list-leave-active {
  transition: all 0.3s ease;
}

.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateX(30px);
}
</style> 