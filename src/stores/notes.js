import { defineStore } from 'pinia'

export const useNotesStore = defineStore('notes', {
  state: () => ({
    notes: []
  }),

  actions: {
    createNote() {
      const note = {
        id: Date.now(),
        title: '',
        content: '',
        createdAt: new Date(),
        updatedAt: new Date()
      }
      this.notes.unshift(note)
      this.saveNotes()
      return note
    },

    updateNote(note) {
      const index = this.notes.findIndex(n => n.id === note.id)
      if (index !== -1) {
        this.notes[index] = { ...note }
        this.saveNotes()
      }
    },

    deleteNote(id) {
      this.notes = this.notes.filter(note => note.id !== id)
      this.saveNotes()
    },

    saveNotes() {
      localStorage.setItem('notes', JSON.stringify(this.notes))
    },

    loadNotes() {
      const saved = localStorage.getItem('notes')
      if (saved) {
        this.notes = JSON.parse(saved)
      }
    }
  }
}) 