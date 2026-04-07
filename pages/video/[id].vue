<template>
  <div v-if="video" class="min-h-screen bg-base animate-fade-up">
    <!-- Header -->
    <div class="sticky top-[60px] z-30 bg-base/80 backdrop-blur-md px-4 py-4 flex items-center border-b border-default mb-6">
      <button @click="$router.back()" class="hidden lg:flex p-2 -ml-2 rounded-full hover:bg-surface transition-colors text-default mr-2">
        <Icon name="lucide:arrow-left" class="w-6 h-6" />
      </button>
      <h1 class="text-lg font-bold text-default truncate flex-1">{{ video.title }}</h1>
    </div>

    <div class="px-4 lg:px-8 max-w-6xl mx-auto pb-20">
      <!-- Player Container -->
      <div class="mb-8">
        <VideoPlayer 
          v-if="youtubeId"
          :src="youtubeId" 
          provider="youtube"
        />
        <div v-else class="aspect-video w-full bg-black rounded-2xl flex items-center justify-center text-muted italic border border-white/10">
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

            <div class="mt-8 p-6 rounded-2xl bg-gradient-to-r from-red-600/20 to-brand/10 border border-red-600/30 flex flex-col md:flex-row items-center gap-6 shadow-xl shadow-red-600/10">
              <div class="flex-1 text-center md:text-left">
                <div class="flex items-center justify-center md:justify-start gap-2 mb-2">
                  <Icon name="lucide:sparkles" class="text-red-500 w-4 h-4 anima-pulse" />
                  <p class="text-[11px] font-black text-red-500 uppercase tracking-[0.2em]">Dukung Syiar Dharma</p>
                </div>
                <p class="text-default text-base font-medium leading-relaxed">
                  Bantu kami menjangkau lebih banyak umat! Subscribe ke channel YouTube <span class="text-brand font-bold underline">{{ youtubeHandle }}</span> untuk mendapatkan pencerahan rutin dan konten spiritual yang menginspirasi setiap minggunya.
                </p>
              </div>
              <a :href="`https://www.youtube.com/${youtubeHandle}?sub_confirmation=1`" 
                 target="_blank" 
                 class="btn-youtube group flex items-center gap-3 px-8 py-4 shrink-0 shadow-2xl shadow-red-600/40 active:scale-95 transition-all">
                <Icon name="lucide:youtube" size="24" class="group-hover:scale-125 transition-transform" />
                <span class="text-sm">SUBSCRIBE SEKARANG</span>
              </a>
            </div>
          </div>

          <!-- Share / Action Buttons -->
          <div class="flex items-center gap-4 pt-6 border-t border-default">
            <button @click="handleShare" class="btn-primary flex items-center gap-2 px-6 py-3">
              <Icon name="lucide:share-2" size="18" />
              Bagikan Video
            </button>
            <AppSaveButton :item="video" type="video" :path="route.path" />
          </div>

          <!-- Commentary Section -->
          <AppComment 
            v-if="video"
            :itemId="video.$id" 
            itemType="video" 
          />
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
const { $appwrite, $db } = useNuxtApp()
const DB_ID = 'sanatana-dharma-db'

const video = ref<any>(null)
const relatedVideos = ref<any[]>([])
let unsubscribe: (() => void) | null = null

const SUPPORTED_CHANNELS = [
  { name: 'Dharma satya luhur', handle: '@Dharmasatyaluhur' },
  { name: 'Haring Kaharingan', handle: '@haringkaharingan4406' },
  { name: 'Ida Bagus Subagia', handle: '@idabagussubagia' }
]

const youtubeHandle = computed(() => {
  if (video.value?.youtubeHandle) return video.value.youtubeHandle
  // Fallback to random if not set
  return SUPPORTED_CHANNELS[Math.floor(Math.random() * SUPPORTED_CHANNELS.length)].handle
})

const { data: videoData, pending: loading } = await useAsyncData(`video-${route.params.id}`, async () => {
  try {
    const res = await $db.listDocuments(DB_ID, 'videos', [
      useAppwriteQuery().equal('slug', route.params.id as string),
      useAppwriteQuery().limit(1)
    ])
    
    if (res.documents.length === 0) return null
    return res.documents[0]
  } catch (e: any) {
    console.error('Error fetching video detail:', e.message)
    return null
  }
})

// Sync videoData to video ref for compatibility with existing code
if (videoData.value) {
  video.value = videoData.value
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

const youtubeId = computed(() => {
  if (!video.value?.url) return null
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = video.value.url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
})

// SEO Meta at top level using computed for SSR reliability
const metaTitle = computed(() => video.value?.title || 'Video Dharma')
const metaDesc = computed(() => video.value?.description ? (video.value.description.substring(0, 160) + '...') : 'Tonton video dharma di Sanatana Dharma Digital.')
const metaImage = computed(() => video.value?.thumbnail || (youtubeId.value ? `https://i.ytimg.com/vi/${youtubeId.value}/maxresdefault.jpg` : '/og-video.png'))

useSeoMeta({
  title: metaTitle,
  ogTitle: metaTitle,
  description: metaDesc,
  ogDescription: metaDesc,
  ogImage: metaImage,
  ogType: 'video.other',
  ogSiteName: 'Sanatana Dharma Digital',
  twitterCard: 'summary_large_image',
  twitterTitle: metaTitle,
  twitterDescription: metaDesc,
  twitterImage: metaImage,
})

if (video.value) {
  useBreadcrumbs().setBreadcrumbLabel(route.params.id as string, video.value.title)
}

// Related videos fetch (client-side is fine after main data)
const { data: relatedRes } = await useAsyncData(`related-videos-${route.params.id}`, async () => {
  if (!video.value) return null
  return await $db.listDocuments(DB_ID, 'videos', [
    useAppwriteQuery().equal('category', video.value.category),
    useAppwriteQuery().notEqual('$id', video.value.$id),
    useAppwriteQuery().limit(4)
  ])
})
if (relatedRes.value) {
  relatedVideos.value = relatedRes.value.documents
}

// Realtime subscription
onMounted(() => {
  if (!video.value) return
  unsubscribe = $appwrite.client.subscribe(
    `databases.${DB_ID}.collections.videos.documents.${video.value.$id}`, 
    (response: any) => {
      if (response.events.some((e: string) => e.includes('.update'))) {
        video.value = response.payload
        useBreadcrumbs().setBreadcrumbLabel(route.params.id as string, response.payload.title)
      } else if (response.events.some((e: string) => e.includes('.delete'))) {
        navigateTo('/video')
      }
    }
  )
})
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

.btn-youtube {
  background-color: #FF0000;
  color: white;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  font-size: 0.75rem;
  border-radius: var(--radius-xl);
}
.btn-youtube:hover {
  filter: brightness(1.1);
  transform: translateY(-2px);
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
