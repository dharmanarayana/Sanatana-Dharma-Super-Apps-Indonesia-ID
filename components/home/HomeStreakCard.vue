<template>
  <div v-if="authStore.isLoggedIn" class="card p-4 bg-orange-50 dark:bg-orange-900/10 border-orange-200/50 hover:border-orange-300 transition-all group">
    <div class="flex items-center gap-3">
      <div class="text-3xl group-hover:scale-110 transition-transform duration-300">🔥</div>
      <div>
        <p class="text-[10px] uppercase font-bold text-orange-600 tracking-widest">Active Today</p>
        <p class="font-black italic text-lg text-default leading-tight">{{ activeUsers }} User Aktif</p>
        <p class="text-[9px] text-orange-600/60 font-medium">Berhasil menjaga streak hari ini</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const { $appwrite } = useNuxtApp()
const authStore = useAuthStore()
const DB_ID = 'sanatana-dharma-db'
const activeUsers = ref(0)

const fetchActiveUsers = async () => {
  try {
    // Get start of today in ISO format
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    
    const res = await $appwrite.databases.listDocuments(DB_ID, 'rituals', [
      useAppwriteQuery().greaterThanEqual('completedAt', today.toISOString()),
      useAppwriteQuery().limit(100) // Rough estimate for now
    ])
    
    // Count unique user IDs
    const uniqueUsers = new Set(res.documents.map(d => d.userId))
    activeUsers.value = uniqueUsers.size
  } catch (e: any) {
    console.error('Error fetching active streaks:', e.message)
  }
}

onMounted(() => {
  if (authStore.isLoggedIn) {
    fetchActiveUsers()
  }
})
</script>
