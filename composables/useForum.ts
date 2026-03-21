/**
 * composables/useForum.ts
 * Logic for fetching posts and listening for realtime updates from Appwrite
 */
export const useForum = () => {
  const { $appwrite } = useNuxtApp()
  const config = useRuntimeConfig()
  
  const DATABASE_ID = config.public.appwriteDatabaseId || 'main'
  const COLLECTION_ID = 'posts'

  const posts = ref<any[]>([])
  const loading = ref(false)

  // Fetch initial posts (Simulated if no collection yet, but ready for real data)
  const fetchPosts = async () => {
    loading.value = true
    try {
      const response = await $appwrite.databases.listDocuments(DATABASE_ID, COLLECTION_ID)
      posts.value = response.documents
    } catch (e) {
      console.warn('Forum: Collection not found or empty.')
      posts.value = []
    } finally {
      loading.value = false
    }
  }

  // Subscribe to Realtime updates
  const subscribeToPosts = () => {
    return $appwrite.client.subscribe(
      [`databases.${DATABASE_ID}.collections.${COLLECTION_ID}.documents`],
      (response: any) => {
        const payload = response.payload
        const event = response.events[0]

        if (event.includes('.create')) {
          posts.value = [payload, ...posts.value]
        } else if (event.includes('.update')) {
          const index = posts.value.findIndex(p => p.$id === payload.$id)
          if (index !== -1) posts.value[index] = payload
        } else if (event.includes('.delete')) {
          posts.value = posts.value.filter(p => p.$id !== payload.$id)
        }
      }
    )
  }

  const createPost = async (content: string, category: string) => {
    // In real implementation:
    // await $appwrite.databases.createDocument(DATABASE_ID, COLLECTION_ID, 'unique()', { content, category, ... })
    // Realtime will automatically add it to the 'posts' ref
    console.log('Forum: Simulating post creation', { content, category })
    // For now, manually add to mock state to show it works
    const newPost = { $id: Date.now().toString(), author: 'Saya (Simulasi)', content, category, likes: 0, comments: 0, createdAt: new Date().toISOString() }
    posts.value = [newPost, ...posts.value]
  }

  return { posts, loading, fetchPosts, subscribeToPosts, createPost }
}
