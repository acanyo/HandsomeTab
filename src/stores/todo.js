import { defineStore } from 'pinia'

export const useTodoStore = defineStore('todo', {
  state: () => ({
    todos: []
  }),

  actions: {
    addTodo(text) {
      this.todos.push({
        id: Date.now(),
        text,
        completed: false,
        createdAt: new Date()
      })
      this.saveTodos()
    },

    toggleTodo(id) {
      const todo = this.todos.find(t => t.id === id)
      if (todo) {
        todo.completed = !todo.completed
        this.saveTodos()
      }
    },

    removeTodo(id) {
      this.todos = this.todos.filter(t => t.id !== id)
      this.saveTodos()
    },

    saveTodos() {
      localStorage.setItem('todos', JSON.stringify(this.todos))
    },

    loadTodos() {
      const saved = localStorage.getItem('todos')
      if (saved) {
        this.todos = JSON.parse(saved)
      }
    }
  }
}) 