import { defineStore } from 'pinia';

const loadInitialState = () => {
  try {
    const raw = localStorage.getItem('user')
    if (raw) {
      const parsed = JSON.parse(raw)
      return {
        id: parsed.id ?? -1,
        name: parsed.name ?? '',
        token: parsed.token ?? '',
        avatarIndex: parsed.avatarIndex ?? 0,
      }
    }
  } catch {
    // ignore
  }
  return {
    id: -1,
    name: '',
    token: '',
    avatarIndex: 0,
  }
}

const persistState = (state: { id: number; name: string; token: string; avatarIndex: number }) => {
  try {
    localStorage.setItem('user', JSON.stringify(state))
  } catch {
    // ignore
  }
}

export const useUserStore = defineStore('user', {
  state: () => loadInitialState(),
  getters: {

  },
  actions: {
    setUser(payload: { id?: number; name?: string; token?: string; avatarIndex?: number }) {
      if (payload.id !== undefined) this.id = payload.id
      if (payload.name !== undefined) this.name = payload.name
      if (payload.token !== undefined) this.token = payload.token
      if (payload.avatarIndex !== undefined) this.avatarIndex = payload.avatarIndex
      persistState({ id: this.id, name: this.name, token: this.token, avatarIndex: this.avatarIndex })
    },
    setToken(token: string) {
      this.token = token
      persistState({ id: this.id, name: this.name, token: this.token, avatarIndex: this.avatarIndex })
    },
    clearUser() {
      this.$reset()
      try { localStorage.removeItem('user') } catch { /* ignore */ }
    }
  },
  persist: true,
})