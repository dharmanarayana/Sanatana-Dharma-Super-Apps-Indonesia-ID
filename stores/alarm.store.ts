import { defineStore } from 'pinia'

export interface Alarm {
  id: string
  name: string
  time: string
  isEnabled: boolean
  completedAt?: string // ISO date string of completion
}

export const useAlarmStore = defineStore('alarm', {
  state: () => ({
    alarms: [
      { id: 'pagi', name: 'Pagi', time: '06:00', isEnabled: true },
      { id: 'siang', name: 'Siang', time: '12:00', isEnabled: true },
      { id: 'sore', name: 'Sore', time: '18:00', isEnabled: true },
    ] as Alarm[],
    youtubeUrl: 'https://www.youtube.com/watch?v=1L4pm8vUF4c',
    youtubeId: '1L4pm8vUF4c',
    isPlaying: false,
    activeAlarmId: null as string | null
  }),
  actions: {
    toggleAlarm(id: string) {
      const alarm = this.alarms.find(a => a.id === id)
      if (alarm) {
        alarm.isEnabled = !alarm.isEnabled
      }
    },
    updateTime(id: string, time: string) {
      const alarm = this.alarms.find(a => a.id === id)
      if (alarm) {
        alarm.time = time
      }
    },
    setPlaying(playing: boolean, alarmId: string | null = null) {
      this.isPlaying = playing
      this.activeAlarmId = alarmId
      
      // If stopping, mark as completed if it was active
      if (!playing && alarmId) {
        this.markCompleted(alarmId)
      }
    },
    markCompleted(id: string) {
      const alarm = this.alarms.find(a => a.id === id)
      if (alarm) {
        alarm.completedAt = new Date().toISOString()
      }
    },
    isCompletedToday(id: string) {
      const alarm = this.alarms.find(a => a.id === id)
      if (!alarm?.completedAt) return false
      
      const completedDate = new Date(alarm.completedAt).toDateString()
      const today = new Date().toDateString()
      return completedDate === today
    }
  },
  persist: true
})
