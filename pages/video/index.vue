<template>
  <div>
    <UiPageHeader icon="📺" title="Video Dharma"
                  subtitle="Pembelajaran visual Sanatana Dharma"
                  back-path="/" />
    <div class="px-4 lg:px-0 py-4 space-y-6">
      <VideoFeaturedBanner :videos="featuredVideos" />
      <VideoKategoriScroll :categories="uniqueCategories" :active="selectedCategory" @select="handleCategorySelect" />
      
      <div v-if="loading" class="flex flex-col items-center justify-center py-20 gap-4">
        <span class="loading loading-spinner text-brand loading-lg"></span>
        <p class="text-muted text-sm animate-pulse">Mengambil video dharma...</p>
      </div>

      <template v-else>
        <UiGrid v-if="videos.length > 0" cols="3" gap="md">
          <VideoCard v-for="video in videos" :key="video.$id" :video="video" />
        </UiGrid>
        <div v-else class="text-center py-20 opacity-40 italic">
          Belum ada video dharma dalam kategori ini.
        </div>

        <UiPagination 
          v-if="total > itemsPerPage"
          v-model="currentPage" 
          :total-items="total" 
          :items-per-page="itemsPerPage" 
          @change="handlePageChange"
        />
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
useSeoMeta({
  title: 'Video Dharma | Sanatana Dharma',
  ogTitle: 'Kumpulan Video Pembelajaran Dharma | Sanatana Dharma',
  description: 'Tonton kumpulan video pembelajaran visual mengenai Sanatana Dharma, filsafat Hindu, dan tradisi spiritual di platform Sanatana Dharma.',
  ogDescription: 'Tonton kumpulan video pembelajaran visual mengenai Sanatana Dharma, filsafat Hindu, dan tradisi spiritual.',
  ogImage: '/og-video-list.png',
  twitterCard: 'summary_large_image',
})

const { videos, total, loading, fetchVideos, subscribe, stop } = useRealtimeVideos()
const { $appwrite, $db } = useNuxtApp()

const selectedCategory = ref('Semua')
const currentPage = ref(1)
const itemsPerPage = ref(12)
const allCategories = ref<string[]>([])

const featuredVideos = computed(() => {
  // We'll just take the first 3 from the first page for featured
  return [...videos.value].slice(0, 3)
})

const uniqueCategories = computed(() => {
  return ['Semua', ...allCategories.value]
})

const fetchAllCategories = async () => {
  try {
    const res = await $db.listDocuments('sanatana-dharma-db', 'videos', [
      useAppwriteQuery().select(['category']),
      useAppwriteQuery().limit(100)
    ])
    const cats = new Set(res.documents.map(v => v.category).filter(Boolean))
    allCategories.value = Array.from(cats as Set<string>)
  } catch (e) {
    console.warn('Failed to fetch categories:', e)
  }
}

const handleCategorySelect = (cat: string) => {
  selectedCategory.value = cat
  currentPage.value = 1
  fetchVideos(currentPage.value, itemsPerPage.value, selectedCategory.value)
}

const handlePageChange = (page: number) => {
  currentPage.value = page
  fetchVideos(currentPage.value, itemsPerPage.value, selectedCategory.value)
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

onMounted(async () => {
  await fetchAllCategories()
  await fetchVideos(currentPage.value, itemsPerPage.value, selectedCategory.value)
  subscribe()
})

onUnmounted(() => {
  stop()
})
</script>
