// composables/useRealtimeAnnouncements.ts
export const useRealtimeAnnouncements = () => {
  const { $appwrite } = useNuxtApp()
  const DB_ID = 'sanatana-dharma-db'
  const COLL_ID = 'news'
  
  const announcements = useState<any[]>('realtime-announcements', () => [])
  const loading = useState<boolean>('realtime-announcements-loading', () => false)
  
  let unsubscribe: (() => void) | null = null

  const fetchAnnouncements = async (limit = 5) => {
    loading.value = true
    try {
      const { $db } = useNuxtApp()
      const queries = [
        useAppwriteQuery().equal('category', 'Pengumuman'),
        useAppwriteQuery().orderDesc('$createdAt'),
        useAppwriteQuery().limit(limit)
      ]
      const res = await $db.listDocuments(DB_ID, COLL_ID, queries)
      announcements.value = res.documents
      // Optional: cache in store too if we had a specific field, 
      // but for now newsItems often contains these too.
    } catch (e: any) {
      console.warn('Announcements fetch failed:', e.message)
    } finally {
      loading.value = false
    }
  }

  const subscribe = () => {
    if (unsubscribe) return

    const channel = `databases.${DB_ID}.collections.${COLL_ID}.documents`
    
    unsubscribe = $appwrite.client.subscribe(channel, (response: any) => {
      const events = response.events || []
      const payload = response.payload
      
      // Filter for Pengumuman category
      if (payload.category !== 'Pengumuman') return

      if (events.some((e: string) => e.includes('.create'))) {
        announcements.value = [payload, ...announcements.value].slice(0, 5)
      } else if (events.some((e: string) => e.includes('.update'))) {
        const idx = announcements.value.findIndex(v => v.$id === payload.$id)
        if (idx !== -1) {
          announcements.value[idx] = payload
        }
      } else if (events.some((e: string) => e.includes('.delete'))) {
        announcements.value = announcements.value.filter(v => v.$id !== payload.$id)
      }
    })
  }

  const stop = () => {
    if (unsubscribe) {
      unsubscribe()
      unsubscribe = null
    }
  }

  return {
    announcements,
    loading,
    fetchAnnouncements,
    subscribe,
    stop
  }
}
