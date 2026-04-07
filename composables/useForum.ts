/**
 * composables/useForum.ts
 * Logic for fetching posts and listening for realtime updates from Appwrite
 */
export const useForum = () => {
  const { $appwrite } = useNuxtApp()
  const config = useRuntimeConfig()
  
  const DATABASE_ID = (config.public.appwriteDatabaseId as string) || 'main'
  const COLLECTION_ID = 'posts'

  const posts = ref<any[]>([])
  const loading = ref(false)
  const categories = ref([
    { name: 'Upacara', count: 0 },
    { name: 'Filsafat', count: 0 },
    { name: 'Sejarah', count: 0 },
    { name: 'Tanya Jawab', count: 0 },
    { name: 'Pinandita (Pemangku)', count: 0 },
    { name: 'Umum', count: 0 }
  ])

  // Fetch initial category counts
  const fetchCategoryCounts = async () => {
    try {
      const { $db } = useNuxtApp()
      const promises = categories.value.map(async (cat: { name: string; count: number }) => {
        const res = await $db.listDocuments(
          DATABASE_ID,
          COLLECTION_ID,
          [useAppwriteQuery().equal('category', cat.name), useAppwriteQuery().limit(1)]
        )
        return { name: cat.name, count: res.total }
      })
      const results = await Promise.all(promises)
      categories.value = results
    } catch (e) {
      console.error('Error fetching category counts:', e)
    }
  }

  // Fetch initial posts (Simulated if no collection yet, but ready for real data)
  const fetchPosts = async () => {
    loading.value = true
    try {
      const { $db } = useNuxtApp()
      const response = await $db.listDocuments(DATABASE_ID, COLLECTION_ID, [
        useAppwriteQuery().orderDesc('$createdAt'),
        useAppwriteQuery().limit(25)
      ])
      posts.value = response.documents
    } catch (e) {
      posts.value = []
    } finally {
      loading.value = false
    }
  }

  // Subscribe to Realtime updates
  const subscribeToPosts = () => {
    const channel = `databases.${DATABASE_ID}.collections.${COLLECTION_ID}.documents`
    return $appwrite.client.subscribe(
      [channel],
      (response: any) => {
        const payload = response.payload
        const event = response.events[0]

        if (event.includes('.create')) {
          posts.value = [payload, ...posts.value]
          // Update category count
          const cat = categories.value.find((c: any) => c.name === payload.category)
          if (cat) cat.count++
        } else if (event.includes('.update')) {
          const index = posts.value.findIndex((p: any) => p.$id === payload.$id)
          if (index !== -1) {
            // Check if category changed
            const oldPost = posts.value[index]
            if (oldPost.category !== payload.category) {
              const oldCat = categories.value.find((c: any) => c.name === oldPost.category)
              const newCat = categories.value.find((c: any) => c.name === payload.category)
              if (oldCat) oldCat.count--
              if (newCat) newCat.count++
            }
            posts.value[index] = payload
          }
        } else if (event.includes('.delete')) {
          const deletedPost = posts.value.find((p: any) => p.$id === payload.$id)
          if (deletedPost) {
            const cat = categories.value.find((c: any) => c.name === deletedPost.category)
            if (cat) cat.count--
          }
          posts.value = posts.value.filter((p: any) => p.$id !== payload.$id)
        }
      }
    )
  }

  const createPost = async (content: string, category: string) => {
    const { user } = useAuthStore()
    if (!user) return

    try {
      const { $db } = useNuxtApp()
      await $db.createDocument(
        DATABASE_ID, 
        COLLECTION_ID, 
        'unique()', 
        { 
          content, 
          category, 
          author: user.name,
          author_id: user.$id,
          author_role: user.prefs?.role || 'user',
          likes: 0,
          comments: 0,
          $createdAt: new Date().toISOString()
        }
      )
    } catch (e) {
      // Fallback for demo if collection doesn't exist
      const newPost = { 
        $id: Date.now().toString(), 
        author: user.name, 
        author_role: user.prefs?.role || 'user',
        content, 
        category, 
        likes: 0, 
        comments: 0, 
        $createdAt: new Date().toISOString() 
      }
      posts.value = [newPost, ...posts.value]
      const cat = categories.value.find((c: any) => c.name === category)
      if (cat) cat.count++
    }
  }

  return { posts, loading, categories, fetchPosts, fetchCategoryCounts, subscribeToPosts, createPost }
}
