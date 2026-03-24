<template>
  <div>
    <UiPageHeader icon="📺" title="Video Dharma"
                  subtitle="Pembelajaran visual Sanatana Dharma"
                  back-path="/" />
    <div class="px-4 lg:px-0 py-4 space-y-6">
      <VideoFeaturedBanner :videos="featuredVideos" />
      <VideoKategoriScroll :categories="uniqueCategories" :active="selectedCategory" @select="selectedCategory = $event" />
      
      <UiGrid v-if="filteredVideos.length > 0" cols="3" gap="md">
        <VideoCard v-for="video in filteredVideos" :key="video.$id" :video="video" />
      </UiGrid>
      <div v-else class="text-center py-20 opacity-40 italic">
        Belum ada video dharma.
      </div>
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

const { videos, loading, fetchVideos, subscribe, stop } = useRealtimeVideos()
const selectedCategory = ref('Semua')

const featuredVideos = computed(() => {
  return [...videos.value].sort((a, b) => 
    new Date(b.$createdAt).getTime() - new Date(a.$createdAt).getTime()
  ).slice(0, 3)
})

const uniqueCategories = computed(() => {
  const cats = new Set(videos.value.map(v => v.category).filter(Boolean))
  return ['Semua', ...Array.from(cats)]
})

const filteredVideos = computed(() => {
  if (selectedCategory.value === 'Semua') return videos.value
  return videos.value.filter(v => v.category === selectedCategory.value)
})

onMounted(async () => {
  await fetchVideos()
  subscribe()
})

onUnmounted(() => {
  stop()
})
</script>
