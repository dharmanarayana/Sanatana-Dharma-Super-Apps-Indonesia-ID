import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null as any,
    isLoggedIn: false,
  }),
  actions: {
    setUser(user: any) {
      this.user = user
      this.isLoggedIn = true
    },
    clearUser() {
      this.user = null
      this.isLoggedIn = false
    }
  },
  getters: {
    isAdmin: (state) => state.user?.prefs?.role === 'admin',
    isMerchant: (state) => state.user?.prefs?.role === 'merchant',
    isPinandita: (state) => state.user?.prefs?.role === 'pinandita'
  },
  persist: true
})
