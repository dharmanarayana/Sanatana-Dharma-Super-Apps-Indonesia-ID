import { ID, Query } from 'appwrite'

export const useSavedItems = () => {
  const { $appwrite } = useNuxtApp()
  const authStore = useAuthStore()
  const DB_ID = 'sanatana-dharma-db'
  const COLLECTION_ID = 'saved_items'

  const savedItems = useState<any[]>('saved_items_list', () => [])
  const isLoading = ref(false)

  const fetchSavedItems = async () => {
    if (!authStore.isLoggedIn || !authStore.user?.$id) return
    
    isLoading.value = true
    try {
      const res = await $appwrite.databases.listDocuments(DB_ID, COLLECTION_ID, [
        Query.equal('userId', authStore.user.$id),
        Query.orderDesc('$createdAt')
      ])
      savedItems.value = res.documents
    } catch (e: any) {
      console.error('Error fetching saved items:', e.message)
    } finally {
      isLoading.value = false
    }
  }

  const isSaved = (itemId: string) => {
    return savedItems.value.some(item => item.itemId === itemId)
  }

  const toggleSave = async (item: { id: string, title: string, image?: string, type: string, path: string }) => {
    if (!authStore.isLoggedIn || !authStore.user?.$id) return
    
    const existing = savedItems.value.find(i => i.itemId === item.id)
    
    try {
      if (existing) {
        await $appwrite.databases.deleteDocument(DB_ID, COLLECTION_ID, existing.$id)
        savedItems.value = savedItems.value.filter(i => i.$id !== existing.$id)
      } else {
        const newDoc = await $appwrite.databases.createDocument(DB_ID, COLLECTION_ID, ID.unique(), {
          userId: authStore.user.$id,
          itemId: item.id,
          itemType: item.type,
          title: item.title,
          image: item.image || '',
          path: item.path,
          createdAt: new Date().toISOString()
        })
        savedItems.value.unshift(newDoc)
      }
    } catch (e: any) {
      console.error('Error toggling save:', e.message)
    }
  }

  return {
    savedItems,
    isLoading,
    fetchSavedItems,
    isSaved,
    toggleSave
  }
}
