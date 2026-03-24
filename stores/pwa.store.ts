import { defineStore } from 'pinia'

// This store will track the PWA registration and update status
export const usePwaStore = defineStore('pwa', {
  state: () => ({
    isInstalled: false,
    updateAvailable: false,
    registration: null as ServiceWorkerRegistration | null
  }),
  actions: {
    setInstalled(val: boolean) {
      this.isInstalled = val
    },
    setUpdateAvailable(val: boolean) {
      this.updateAvailable = val
    },
    setRegistration(reg: ServiceWorkerRegistration) {
      this.registration = reg
    }
  }
})
