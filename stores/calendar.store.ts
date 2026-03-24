import { defineStore } from 'pinia'

export const useCalendarStore = defineStore('calendar', {
  state: () => ({
    events: [] as any[],
    wukuData: {} as Record<string, any>,
    lastUpdated: 0
  }),
  actions: {
    setEvents(events: any[]) {
      this.events = events
      this.lastUpdated = Date.now()
    },
    setWukuData(date: string, data: any) {
      this.wukuData[date] = data
    },
    getWukuData(date: string) {
      return this.wukuData[date]
    }
  },
  persist: true
})
