import { defineStore } from 'pinia'

export interface Alarm {
  id: string
  name: string
  time: string
  isEnabled: boolean
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
    isPlaying: false
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
    setPlaying(playing: boolean) {
      this.isPlaying = playing
    }
  },
  persist: true
})
