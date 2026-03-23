// composables/useRealtimeVideos.ts
export const useRealtimeVideos = () => {
  const { $appwrite } = useNuxtApp()
  const DB_ID = 'sanatana-dharma-db'
  const COLL_ID = 'videos'
  
  const videos = useState<any[]>('realtime-videos', () => [])
  const loading = useState<boolean>('realtime-videos-loading', () => false)
  
  let unsubscribe: (() => void) | null = null

  const fetchVideos = async () => {
    loading.value = true
    try {
      const res = await $appwrite.databases.listDocuments(DB_ID, COLL_ID, [
        useAppwriteQuery().orderDesc('$createdAt')
      ])
      videos.value = res.documents
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
        videos.value = [payload, ...videos.value]
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
    loading,
    fetchVideos,
    subscribe,
    stop
  }
}
