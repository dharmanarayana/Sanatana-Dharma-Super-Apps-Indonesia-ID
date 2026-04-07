export const useTriSandhya = () => {
  const { $appwrite } = useNuxtApp()
  const authStore = useAuthStore()

  const DB_ID = 'sanatana_dharma_db'
  const ALARM_COLL = 'alarm_settings'
  const STREAK_COLL = 'streak_tracker'

  const waktuTriSandhya = {
    pagi:  '06:00',
    siang: '12:00',
    sore:  '18:00',
  }

  // Request browser notification permission
  const requestPermission = async () => {
    if ('Notification' in window) {
      const perm = await Notification.requestPermission()
      return perm === 'granted'
    }
    return false
  }

  // Schedule alarm using Web Notification API
  const scheduleAlarm = (waktu: string, label: string, suara: string = 'genta') => {
    const [jam, menit] = waktu.split(':').map(Number)
    const now = new Date()
    const target = new Date()
    target.setHours(jam, menit, 0, 0)
    if (target <= now) target.setDate(target.getDate() + 1)

    const delay = target.getTime() - now.getTime()
    setTimeout(() => {
      if (Notification.permission === 'granted') {
        new Notification(`🕉️ Saatnya ${label}`, {
          body: 'Waktunya melaksanakan Tri Sandhya. Om Swastyastu.',
          icon: '/icons/icon-192x192.png',
          badge: '/icons/icon-192x192.png',
          tag: `tri-sandhya-${label}`,
        })
      }
      const audio = new Audio(`/sounds/${suara}.mp3`)
      audio.play().catch(() => {})
      // Reschedule for tomorrow
      scheduleAlarm(waktu, label, suara)
    }, delay)
  }

  // Mark Tri Sandhya as done for today
  const markDone = async (waktu: 'pagi' | 'siang' | 'sore') => {
    if (!authStore.user) return
    const { $db } = useNuxtApp()
    const today = new Date().toISOString().split('T')[0]
    const { Query } = await import('appwrite')

    try {
      const existing = await $db.listDocuments(DB_ID, STREAK_COLL, [
        Query.equal('user_id', authStore.user.$id),
        Query.equal('tanggal', today),
      ])

      const update = { [`${waktu}_done`]: true }

      if (existing.documents.length > 0) {
        await $db.updateDocument(DB_ID, STREAK_COLL, existing.documents[0].$id, update)
      } else {
        await $db.createDocument(DB_ID, STREAK_COLL, 'unique()', {
          user_id: authStore.user.$id,
          tanggal: today,
          pagi_done: waktu === 'pagi',
          siang_done: waktu === 'siang',
          sore_done: waktu === 'sore',
        })
      }
    } catch (e: any) {
      console.error('Error marking done (Failover active):', e.message)
    }
  }

  return { waktuTriSandhya, requestPermission, scheduleAlarm, markDone }
}
