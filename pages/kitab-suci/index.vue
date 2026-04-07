<template>
  <div>
    <UiPageHeader icon="📖" title="Kitab Suci Digital"
                  subtitle="Weda, Gita, Ramayana & lebih banyak lagi"
                  back-path="/" />
    <div class="px-4 lg:px-0 py-4">
      <!-- Loading Skeleton -->
      <div v-if="loading && kitabList.length === 0" class="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div v-for="i in 8" :key="i" class="aspect-[3/4] p-4 bg-surface border border-default rounded-2xl flex flex-col items-center justify-center gap-3">
          <UiSkeleton height="4rem" width="4rem" circle />
          <UiSkeleton height="1.5rem" width="80%" />
          <UiSkeleton height="1rem" width="60%" />
        </div>
      </div>

      <UiGrid v-else-if="kitabList.length > 0" cols="4" gap="md">
        <KitabCard v-for="k in kitabList" :key="k.$id" :kitab="k" 
                   @click="navigateTo(`/kitab-suci/${k.slug}`)" />
      </UiGrid>
      <div v-else-if="!loading && kitabList.length === 0" class="text-center py-20 opacity-40 italic">
        Belum ada kitab suci yang terdaftar.
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useKitabStore } from '~/stores/kitab.store'

useSeoMeta({
  title: 'Kitab Suci Digital',
  ogTitle: 'Perpustakaan Kitab Suci Hindu - Sanatana Dharma Digital',
  description: 'Akses berbagai kitab suci Hindu seperti Weda, Bhagavad Gita, Sarasamuscaya, dan lainnya secara digital.',
  ogDescription: 'Akses berbagai kitab suci Hindu seperti Weda, Bhagavad Gita, Sarasamuscaya, dan lainnya secara digital.',
})

const { $appwrite, $db } = useNuxtApp()
const kitabStore = useKitabStore()
const DB_ID = 'sanatana-dharma-db'

const kitabList = ref<any[]>(kitabStore.kitabList)
const loading = ref(true)

const fetchKitab = async () => {
  loading.value = true
  try {
    const res = await $db.listDocuments(DB_ID, 'holy_books', [
      useAppwriteQuery().orderAsc('title')
    ])
    kitabList.value = res.documents
    kitabStore.setKitabList(res.documents)
  } catch (e: any) {
    console.warn('Network error, using cached kitab list:', e.message)
    if (kitabList.value.length === 0) {
      // Fallback to empty if absolutely nothing
    }
  } finally {
    loading.value = false
  }
}

onMounted(fetchKitab)
</script>
