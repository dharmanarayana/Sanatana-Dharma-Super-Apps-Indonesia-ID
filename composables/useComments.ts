/**
 * composables/useComments.ts
 * Logic for fetching, adding, and listening for commentary updates from Appwrite
 */
export const useComments = () => {
  const { $appwrite } = useNuxtApp()
  const config = useRuntimeConfig()
  
  const DATABASE_ID = (config.public.appwriteDatabaseId as string) || 'sanatana-dharma-db'
  const COLLECTION_ID = 'comments'

  const comments = ref<any[]>([])
  const loading = ref(false)

  const fetchComments = async (itemId: string, itemType: 'pura' | 'video') => {
    loading.value = true
    try {
      const { $db } = useNuxtApp()
      const response = await $db.listDocuments(DATABASE_ID, COLLECTION_ID, [
        useAppwriteQuery().equal('itemId', itemId),
        useAppwriteQuery().equal('itemType', itemType),
        useAppwriteQuery().orderDesc('$createdAt'),
        useAppwriteQuery().limit(50)
      ])
      comments.value = response.documents
    } catch (e: any) {
      console.warn('⚠️ Could not fetch comments from Appwrite:', e.message)
      comments.value = []
    } finally {
      loading.value = false
    }
  }

  const addComment = async (itemId: string, itemType: 'pura' | 'video', content: string) => {
    const authStore = useAuthStore()
    if (!authStore.user) return

    try {
      const payload = {
        itemId,
        itemType,
        content,
        userId: authStore.user.$id,
        userName: authStore.user.name,
        userRole: authStore.user.prefs?.role || 'user',
        $createdAt: new Date().toISOString()
      }
      
      const { $db } = useNuxtApp()
      const response = await $db.createDocument(
        DATABASE_ID,
        COLLECTION_ID,
        'unique()',
        payload
      )
      
      // If we don't have realtime subscription active, manually add to list
      // (though usually realtime will handle this if subscribed)
      return response
    } catch (e: any) {
      console.error('❌ Error adding comment:', e.message)
      throw e
    }
  }

  const subscribeToComments = (itemId: string, itemType: 'pura' | 'video') => {
    const channel = `databases.${DATABASE_ID}.collections.${COLLECTION_ID}.documents`
    return $appwrite.client.subscribe(
      [channel],
      (response: any) => {
        const payload = response.payload
        const event = response.events[0]

        // Filter for this specific item
        if (payload.itemId !== itemId || payload.itemType !== itemType) return

        if (event.includes('.create')) {
          // Avoid duplicates if manually added
          if (!comments.value.some(c => c.$id === payload.$id)) {
            comments.value = [payload, ...comments.value]
          }
        } else if (event.includes('.update')) {
          const index = comments.value.findIndex((c: any) => c.$id === payload.$id)
          if (index !== -1) {
            comments.value[index] = payload
          }
        } else if (event.includes('.delete')) {
          comments.value = comments.value.filter((c: any) => c.$id !== payload.$id)
        }
      }
    )
  }

  return { comments, loading, fetchComments, addComment, subscribeToComments }
}
