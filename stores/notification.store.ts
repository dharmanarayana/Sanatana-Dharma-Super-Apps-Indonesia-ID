import { defineStore } from 'pinia'

export interface NotificationItem {
  id: string
  type: 'news' | 'video' | 'post' | 'donation' | 'info'
  title: string
  message: string
  path: string
  icon: string
  read: boolean
  createdAt: string
}

export const useNotificationStore = defineStore('notifications', {
  state: () => ({
    notifications: [] as NotificationItem[],
    showPanel: false,
    latestToast: null as NotificationItem | null,
    toastTimer: null as ReturnType<typeof setTimeout> | null,
  }),
  actions: {
    addNotification(notif: Omit<NotificationItem, 'id' | 'read' | 'createdAt'>) {
      const newNotif: NotificationItem = {
        ...notif,
        id: Date.now().toString() + Math.random().toString(36).slice(2, 7),
        read: false,
        createdAt: new Date().toISOString(),
      }
      this.notifications.unshift(newNotif)
      // Limit to 50 notifications max
      if (this.notifications.length > 50) {
        this.notifications = this.notifications.slice(0, 50)
      }
      // Show toast alert
      this.showToast(newNotif)
    },
    showToast(notif: NotificationItem) {
      if (this.toastTimer) clearTimeout(this.toastTimer)
      this.latestToast = notif
      this.toastTimer = setTimeout(() => {
        this.dismissToast()
      }, 4000)
    },
    dismissToast() {
      this.latestToast = null
      if (this.toastTimer) {
        clearTimeout(this.toastTimer)
        this.toastTimer = null
      }
    },
    markRead(id: string) {
      const notif = this.notifications.find(n => n.id === id)
      if (notif) notif.read = true
    },
    markAllRead() {
      this.notifications.forEach(n => (n.read = true))
    },
    removeNotification(id: string) {
      this.notifications = this.notifications.filter(n => n.id !== id)
    },
    clearAll() {
      this.notifications = []
    },
    togglePanel() {
      this.showPanel = !this.showPanel
    },
    closePanel() {
      this.showPanel = false
    },
  },
  getters: {
    unreadCount: (state) => state.notifications.filter(n => !n.read).length,
    unreadNotifications: (state) => state.notifications.filter(n => !n.read),
    allNotifications: (state) => state.notifications,
  },
  persist: true,
})
