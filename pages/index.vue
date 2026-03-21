<template>
  <div class="px-4 lg:px-0 py-4 lg:py-0">

    <!-- Welcome Message -->
    <div v-if="authStore.user" class="mb-6">
      <h1 class="text-2xl font-bold text-default font-serif">
        Om Swastyastu, <span class="text-brand">{{ firstName }}</span> 🙏
      </h1>
      <p class="text-secondary text-sm mt-1">Selamat datang kembali di aktivitas spiritualmu.</p>
    </div>

    <!-- Banner wuku hari ini -->
    <HomeBanner class="mb-6" />

    <!-- ═══ MOBILE LAYOUT ═══ -->
    <div class="lg:hidden">
      <!-- Menu Grid 3-col dengan judul baris -->
      <section class="mb-6">
        <HomeMenuGrid />
      </section>

      <!-- Info Cards — stacked -->
      <section class="space-y-4 mb-6">
        <HomeWukuToday />
        <HomeHariRayaTerdekat />
        <HomeStreakCard />
      </section>
    </div>

    <!-- ═══ DESKTOP LAYOUT ═══ -->
    <section class="hidden lg:grid lg:grid-cols-3 gap-6 mb-8">
      <div class="lg:col-span-2">
        <HomeMenuGrid />
      </div>
      <div class="space-y-4">
        <HomeWukuToday />
        <HomeHariRayaTerdekat />
        <HomeStreakCard />
      </div>
    </section>

    <!-- Konten terbaru — sama di mobile & desktop -->
    <section class="mb-6">
      <h2 class="font-bold text-default text-lg mb-3">Video Terbaru</h2>
      <UiGrid v-if="videos.length > 0" cols="3" gap="md">
        <VideoCard v-for="video in videos" :key="video.$id" :video="video" />
      </UiGrid>
      <div v-else class="text-center py-10 opacity-50 italic text-sm">Belum ada video.</div>
    </section>

    <section class="mb-6">
      <h2 class="font-bold text-default text-lg mb-3">Berita Terkini</h2>
      <UiGrid v-if="news.length > 0" cols="2" gap="md">
        <BeritaCard v-for="item in news" :key="item.$id" :news="item" />
      </UiGrid>
      <div v-else class="text-center py-10 opacity-50 italic text-sm">Belum ada berita.</div>
    </section>

  </div>
</template>

<script setup lang="ts">
const { $appwrite } = useNuxtApp()
const authStore = useAuthStore()

const DB_ID = 'sanatana-dharma-db'

const videos = ref<any[]>([])
const news = ref<any[]>([])

const firstName = computed(() => {
  if (!authStore.user || !authStore.user.name) return 'Umat Sedharma'
  return authStore.user.name.split(' ')[0]
})

const fetchData = async () => {
  try {
    const [vRes, nRes] = await Promise.all([
      $appwrite.databases.listDocuments(DB_ID, 'videos', [
        useAppwriteQuery().orderDesc('$createdAt'),
        useAppwriteQuery().limit(3)
      ]),
      $appwrite.databases.listDocuments(DB_ID, 'news', [
        useAppwriteQuery().orderDesc('$createdAt'),
        useAppwriteQuery().limit(2)
      ])
    ])
    videos.value = vRes.documents
    news.value = nRes.documents
  } catch (e: any) {
    console.error('Error fetching home content:', e.message)
  }
}

onMounted(fetchData)
</script>
