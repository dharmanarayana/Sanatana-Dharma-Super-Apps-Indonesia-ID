<template>
  <div v-if="video" class="min-h-screen bg-base animate-fade-up">
    <!-- Header -->
    <div class="sticky top-0 z-30 bg-base/80 backdrop-blur-md px-4 py-4 flex items-center border-b border-default mb-6">
      <button @click="$router.back()" class="hidden lg:flex p-2 -ml-2 rounded-full hover:bg-surface transition-colors text-default mr-2">
        <Icon name="lucide:arrow-left" class="w-6 h-6" />
      </button>
      <h1 class="text-lg font-bold text-default truncate flex-1">{{ video.title }}</h1>
    </div>

    <div class="px-4 lg:px-8 max-w-6xl mx-auto pb-20">
      <!-- Player Container -->
      <div class="aspect-video w-full bg-black rounded-2xl overflow-hidden shadow-2xl ring-1 ring-white/10 mb-8">
        <iframe v-if="youtubeId"
                class="w-full h-full"
                :src="`https://www.youtube.com/embed/${youtubeId}?rel=0&modestbranding=1`"
                title="YouTube video player"
                frameborder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowfullscreen></iframe>
        <div v-else class="w-full h-full flex items-center justify-center text-muted italic">
          Video tidak dapat dimuat.
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Main Info -->
        <div class="lg:col-span-2 space-y-6">
          <div>
            <div class="flex items-center gap-3 mb-4">
              <span class="px-3 py-1 bg-brand/10 text-brand text-xs font-bold rounded-full uppercase tracking-widest">
                {{ video.category }}
              </span>
              <span class="text-xs text-muted flex items-center gap-1">
                <Icon name="lucide:calendar" size="14" />
                {{ formatDate(video.$createdAt) }}
              </span>
            </div>
            <h2 class="text-2xl lg:text-3xl font-bold text-default mb-4 leading-tight">
              {{ video.title }}
            </h2>
            <div class="prose prose-invert max-w-none text-muted leading-relaxed text-base">
              {{ video.description || 'Tidak ada deskripsi untuk video ini.' }}
            </div>
          </div>

          <!-- Share / Action Buttons -->
          <div class="flex items-center gap-4 pt-6 border-t border-default">
            <button @click="handleShare" class="btn-primary flex items-center gap-2 px-6 py-3">
              <Icon name="lucide:share-2" size="18" />
              Bagikan Video
            </button>
            <button class="btn-ghost flex items-center gap-2 px-6 py-3 text-muted hover:text-brand">
              <Icon name="lucide:bookmark" size="18" />
              Simpan
            </button>
          </div>
        </div>

        <!-- Sidebar (Related) -->
        <div class="space-y-6">
          <h3 class="font-bold text-sm uppercase tracking-widest text-brand border-b border-brand pb-2">
            Video Terkait
          </h3>
          <div v-if="relatedVideos.length > 0" class="space-y-4">
            <VideoCard v-for="rv in relatedVideos" :key="rv.$id" :video="rv" />
          </div>
          <p v-else class="text-xs text-muted italic">Tidak ada video terkait lainnya.</p>
        </div>
      </div>
    </div>
  </div>
  <div v-else class="min-h-screen flex items-center justify-center bg-base">
    <div class="text-center space-y-4">
      <span class="loading loading-spinner text-brand loading-lg"></span>
      <p class="text-muted text-sm animate-pulse">Mengambil video dharma...</p>
    </div>
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
const { $appwrite } = useNuxtApp()
const DB_ID = 'sanatana-dharma-db'

const video = ref<any>(null)
const relatedVideos = ref<any[]>([])
let unsubscribe: (() => void) | null = null

const youtubeId = computed(() => {
  if (!video.value?.url) return null
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = video.value.url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
})

const fetchDetail = async () => {
  try {
    // Fetch by slug
    const res = await $appwrite.databases.listDocuments(DB_ID, 'videos', [
      useAppwriteQuery().equal('slug', route.params.id as string),
      useAppwriteQuery().limit(1)
    ])
    
    if (res.documents.length === 0) throw new Error('Video tidak ditemukan')
    
    const doc = res.documents[0]
    video.value = doc
    
    // Breadcrumb title
    useBreadcrumbs().setBreadcrumbLabel(route.params.id as string, doc.title)

    // Subscribe to this specific video
    unsubscribe = $appwrite.client.subscribe(
      `databases.${DB_ID}.collections.videos.documents.${doc.$id}`, 
      (response: any) => {
        if (response.events.some((e: string) => e.includes('.update'))) {
          video.value = response.payload
          useBreadcrumbs().setBreadcrumbLabel(route.params.id as string, response.payload.title)
        } else if (response.events.some((e: string) => e.includes('.delete'))) {
          navigateTo('/video')
        }
      }
    )

    // Fetch related
    const relatedRes = await $appwrite.databases.listDocuments(DB_ID, 'videos', [
      useAppwriteQuery().equal('category', doc.category),
      useAppwriteQuery().notEqual('$id', doc.$id),
      useAppwriteQuery().limit(4)
    ])
    relatedVideos.value = relatedRes.documents
  } catch (e: any) {
    console.error('Error fetching video detail:', e.message)
  }
}

const formatDate = (date: string) => {
  if (!date) return '-'
  return new Date(date).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  })
}

const handleShare = async () => {
  if (navigator.share && video.value) {
    await navigator.share({
      title: video.value.title,
      text: `Mari kita menonton video dharma: ${video.value.title}`,
      url: window.location.href
    })
  }
}

onMounted(fetchDetail)
onUnmounted(() => {
  if (unsubscribe) unsubscribe()
})
</script>

<style scoped>
.btn-primary {
  background-color: var(--brand-primary);
  color: var(--text-inverse);
  font-weight: 700;
  border-radius: var(--radius-xl);
  transition: all 0.2s;
}
.btn-primary:hover {
  transform: translateY(-2px);
  filter: brightness(1.1);
}
.btn-primary:active {
  transform: scale(0.95);
}

.btn-ghost {
  background-color: rgba(var(--bg-surface), 0.5);
  backdrop-filter: blur(8px);
  border: 1px solid var(--border-default);
  font-weight: 700;
  border-radius: var(--radius-xl);
  transition: all 0.2s;
}
</style>
