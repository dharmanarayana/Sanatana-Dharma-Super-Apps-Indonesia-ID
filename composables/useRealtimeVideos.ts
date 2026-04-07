// composables/useRealtimeVideos.ts
export const useRealtimeVideos = () => {
  const { $appwrite } = useNuxtApp()
  const DB_ID = 'sanatana-dharma-db'
  const COLL_ID = 'videos'
  
  const videos = useState<any[]>('realtime-videos', () => [])
  const total = useState<number>('realtime-videos-total', () => 0)
  const loading = useState<boolean>('realtime-videos-loading', () => false)
  
  let unsubscribe: (() => void) | null = null

  const fetchVideos = async (page = 1, limit = 12, category = 'Semua') => {
    loading.value = true
    try {
      const queries = [
        useAppwriteQuery().orderDesc('$createdAt'),
        useAppwriteQuery().limit(limit),
        useAppwriteQuery().offset((page - 1) * limit)
      ]

      if (category && category !== 'Semua') {
        queries.push(useAppwriteQuery().equal('category', category))
      }

      const { $db } = useNuxtApp()
      const res = await $db.listDocuments(DB_ID, COLL_ID, queries)
      videos.value = res.documents
      total.value = res.total
    } catch (e: any) {
      console.error('Error fetching videos:', e.message)
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
      
      if (events.some((e: string) => e.includes('.create'))) {
        // For simple realtime, we just add to the top, but pagination might make this messy.
        // However, we'll keep it for now as per original design.
        videos.value = [payload, ...videos.value].slice(0, 50) // Keep it reasonable
      } else if (events.some((e: string) => e.includes('.update'))) {
        const idx = videos.value.findIndex(v => v.$id === payload.$id)
        if (idx !== -1) {
          videos.value[idx] = payload
        }
      } else if (events.some((e: string) => e.includes('.delete'))) {
        videos.value = videos.value.filter(v => v.$id !== payload.$id)
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
    videos,
    total,
    loading,
    fetchVideos,
    subscribe,
    stop
  }
}
