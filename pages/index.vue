<template>
  <div class="px-4 lg:px-0 py-4 lg:py-0">

    <!-- Desktop Welcome (keep as is) -->
    <div class="hidden lg:block mb-6">
      <ClientOnly>
        <h1 class="text-2xl font-bold text-default font-serif">
          Om Swastyastu, <span class="text-brand">{{ firstName }}</span> 🙏
        </h1>
        <template #fallback>
          <h1 class="text-2xl font-bold text-default font-serif">
            Om Swastyastu, <span class="text-brand">Umat Sedharma</span> 🙏
          </h1>
        </template>
      </ClientOnly>
      <p class="text-secondary text-sm mt-1">Digital — Harmoni dalam Kehidupan Spiritual.</p>
    </div>

    <!-- Banner wuku hari ini -->
    <HomeBanner class="mb-6" />

    <!-- Quick Menu Grid 4-col (MOBILE) -->
    <section class="lg:hidden mb-8">
      <HomeMenuGrid />
    </section>

    <!-- Info Cards — stacked -->
    <section class="lg:hidden space-y-4 mb-6">
      <HomeWukuToday />
      <HomeHariRayaTerdekat />
      <HomeStreakCard />
    </section>

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
      <UiGrid v-if="videos?.length > 0" cols="3" gap="md">
        <VideoCard v-for="video in videos" :key="video.$id" :video="video" />
      </UiGrid>
      <div v-else class="text-center py-10 opacity-50 italic text-sm">Belum ada video.</div>
    </section>

    <section class="mb-6">
      <h2 class="font-bold text-default text-lg mb-3">Berita Terkini</h2>
      <UiGrid v-if="news?.length > 0" cols="2" gap="md">
        <NuxtLink v-for="item in news" :key="item.$id" :to="`/berita/${item.$id}`" class="block no-underline">
          <BeritaCard :news="item" />
        </NuxtLink>
      </UiGrid>
      <div v-else class="text-center py-10 opacity-50 italic text-sm">Belum ada berita.</div>
    </section>

  </div>
</template>

<script setup lang="ts">
const { $appwrite, $db } = useNuxtApp()
const authStore = useAuthStore()

useSeoMeta({
  title: 'Beranda',
  ogTitle: 'Sanatana Dharma Digital - Beranda',
  description: 'Selamat datang di Sanatana Dharma Digital, platform keagamaan Hindu Indonesia yang lengkap dengan Kalender Saka, Doa Mantra, dan Kitab Suci.',
  ogDescription: 'Selamat datang di Sanatana Dharma Digital, platform keagamaan Hindu Indonesia yang lengkap dengan Kalender Saka, Doa Mantra, dan Kitab Suci.',
})

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
      $db.listDocuments(DB_ID, 'videos', [
        useAppwriteQuery().orderDesc('$createdAt'),
        useAppwriteQuery().limit(3)
      ]),
      $db.listDocuments(DB_ID, 'news', [
        useAppwriteQuery().orderDesc('$createdAt'),
        useAppwriteQuery().limit(2)
      ])
    ])
    videos.value = vRes.documents
    news.value = nRes.documents
  } catch (e: any) {
    // Sliently handle errors for production
  }
}

onMounted(fetchData)
</script>
