// composables/useRealtimeNews.ts
export const useRealtimeNews = () => {
  const { $appwrite } = useNuxtApp()
  const DB_ID = 'sanatana-dharma-db'
  const COLL_ID = 'news'
  
  const newsItems = useState<any[]>('realtime-news', () => [])
  const total = useState<number>('realtime-news-total', () => 0)
  const loading = useState<boolean>('realtime-news-loading', () => false)
  
  let unsubscribe: (() => void) | null = null

  const fetchNews = async (limit = 10, category?: string) => {
    loading.value = true
    try {
      const queries = [
        useAppwriteQuery().orderDesc('$createdAt'),
        useAppwriteQuery().limit(limit)
      ]

      if (category && category !== 'Semua') {
        queries.push(useAppwriteQuery().equal('category', category))
      }

      const res = await $appwrite.databases.listDocuments(DB_ID, COLL_ID, queries)
      newsItems.value = res.documents
      total.value = res.total
    } catch (e: any) {
      console.error('Error fetching news:', e.message)
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
        // Add to top if it matches current filter (simplified for now)
        newsItems.value = [payload, ...newsItems.value].slice(0, 50)
        total.value++
      } else if (events.some((e: string) => e.includes('.update'))) {
        const idx = newsItems.value.findIndex(v => v.$id === payload.$id)
        if (idx !== -1) {
          newsItems.value[idx] = payload
        }
      } else if (events.some((e: string) => e.includes('.delete'))) {
        newsItems.value = newsItems.value.filter(v => v.$id !== payload.$id)
        total.value--
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
    newsItems,
    total,
    loading,
    fetchNews,
    subscribe,
    stop
  }
}
