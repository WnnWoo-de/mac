import { defineStore } from 'pinia'

const STORAGE_KEY = 'auth-state'

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return { isLoggedIn: false, user: null, points: 0, history: [] }
    const parsed = JSON.parse(raw)
    return {
      isLoggedIn: Boolean(parsed?.isLoggedIn),
      user: parsed?.user ?? null,
      points: Number.isFinite(parsed?.points) ? parsed.points : 0,
      history: Array.isArray(parsed?.history) ? parsed.history : [],
    }
  } catch (e) {
    return { isLoggedIn: false, user: null, points: 0, history: [] }
  }
}

function save(state) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
}

export const useAuthStore = defineStore('auth', {
  state: () => loadState(),
  getters: {
    username: (state) => state.user?.username ?? '',
  },
  actions: {
    login(user) {
      this.user = user
      this.isLoggedIn = true
      if (!Number.isFinite(this.points)) this.points = 0
      if (!Array.isArray(this.history)) this.history = []
      save(this.$state)
    },
    logout() {
      this.user = null
      this.isLoggedIn = false
      save(this.$state)
    },
    addPoints(amount, reason = '活动奖励') {
      const val = Number(amount) || 0
      if (val <= 0) return
      this.points += val
      this.history.unshift({ type: 'income', amount: val, reason, at: Date.now() })
      save(this.$state)
    },
    spendPoints(amount, reason = '积分消费') {
      const val = Number(amount) || 0
      if (val <= 0) return false
      if (this.points < val) return false
      this.points -= val
      this.history.unshift({ type: 'expense', amount: val, reason, at: Date.now() })
      save(this.$state)
      return true
    },
  },
})