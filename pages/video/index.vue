<template>
  <div>
    <UiPageHeader icon="📺" title="Video Dharma"
                  subtitle="Pembelajaran visual Sanatana Dharma"
                  back-path="/" />
    <div class="px-4 lg:px-0 py-4 space-y-6">
      <VideoFeaturedBanner />
      <VideoKategoriScroll />
      <UiGrid v-if="videos.length > 0" cols="3" gap="md">
        <VideoCard v-for="video in videos" :key="video.$id" :video="video" />
      </UiGrid>
      <div v-else class="text-center py-20 opacity-40 italic">
        Belum ada video dharma.
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const { $appwrite } = useNuxtApp()
const DB_ID = 'sanatana-dharma-db'
const videos = ref<any[]>([])

const fetchVideos = async () => {
  try {
    const res = await $appwrite.databases.listDocuments(DB_ID, 'videos', [
      useAppwriteQuery().orderDesc('$createdAt')
    ])
    videos.value = res.documents
  } catch (e: any) {
    console.error('Error fetching videos:', e.message)
  }
}

onMounted(fetchVideos)
</script>
