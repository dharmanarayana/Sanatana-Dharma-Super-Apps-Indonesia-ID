/**
 * composables/useProfile.ts
 * Logic for fetching user statistics, rituals, and badges from Appwrite
 */
import { Query } from 'appwrite'

export const useProfile = () => {
  const { $appwrite } = useNuxtApp()
  const authStore = useAuthStore()
  const config = useRuntimeConfig()
  
  const DATABASE_ID = (config.public.appwriteDatabaseId || 'sanatana-dharma-db') as string
  const COLLECTION_RITUALS = 'rituals'
  const COLLECTION_POSTS = 'posts'
  
  const stats = ref({
    points: 0,
    donations: 0,
    badges: 0,
    streak: 0,
    postCount: 0,
    daysJoined: 0
  })
  
  const loading = ref(false)

  // Level Calculation Logic:
  // formula: (PostCount * 3) + (Streak * 2) + (DaysActive * 0.5) + (Points / 10)
  const level = computed(() => {
    const baseLevel = Math.floor(
      (stats.value.postCount * 3) + 
      (stats.value.streak * 2) + 
      (stats.value.daysJoined * 0.5) +
      (stats.value.points / 10)
    )
    return Math.max(1, baseLevel)
  })

  const rank = computed(() => {
    if (level.value >= 50) return 'Sangat Luar Biasa 👑'
    if (level.value >= 30) return 'Luar Biasa 📿'
    if (level.value >= 15) return 'Penekun Sastra 📖'
    if (level.value >= 5) return 'Semeton Aktif 🕯️'
    return 'Warga Baru 🌱'
  })

  const fetchUserStats = async () => {
    if (!authStore.user) return
    loading.value = true
    
    try {
      const USER_ID = authStore.user.$id as string
      
      // Calculate Days Joined (Always runs)
      const joinedDate = new Date(authStore.user.$createdAt)
      const now = new Date()
      const diffTime = Math.abs(now.getTime() - joinedDate.getTime())
      stats.value.daysJoined = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

      // 1. Fetch Account Prefs for Points (Highest Priority)
      try {
        const userObj = await $appwrite.account.get()
        const prefs = userObj.prefs || {}
        stats.value.points = Number(prefs.points || 0)
        stats.value.badges = Math.floor(stats.value.points / 1000)
      } catch (e) {
        console.warn('Profile points fetch failed:', e)
      }

      // 2. Fetch Rituals for Streak (Safe Catch)
      try {
        const rituals = await $appwrite.databases.listDocuments(
          DATABASE_ID, 
          COLLECTION_RITUALS,
          [Query.equal('userId', USER_ID), Query.limit(1), Query.orderDesc('completedAt')]
        )
        if (rituals.documents.length > 0) {
          stats.value.streak = rituals.documents[0].streak || 0
        }
      } catch (e) {
        // Silently fail or log minimally
      }

      // 3. Fetch Forum Post Count (Safe Catch)
      try {
        const forumPosts = await $appwrite.databases.listDocuments(
          DATABASE_ID,
          COLLECTION_POSTS,
          [Query.equal('userId', USER_ID), Query.limit(1)]
        )
        stats.value.postCount = forumPosts.total
      } catch (e) {
        // Silently fail or log minimally
      }

      // 4. Subscribe to Realtime Account Updates
      $appwrite.client.subscribe('account', (response: any) => {
        if (response.events.includes('account.update.prefs')) {
          stats.value.points = Number(response.payload.prefs?.points || 0)
          stats.value.badges = Math.floor(stats.value.points / 1000)
        }
      })
      
    } catch (e) {
      console.error('Critical Profile Stats Error:', e)
    } finally {
      loading.value = false
    }
  }

  return { stats, loading, level, rank, fetchUserStats }
}
