<template>
  <div>
    <UiPageHeader icon="📰" title="Berita & Informasi"
                  subtitle="Kabar terkini seputar Sanatana Dharma"
                  back-path="/" />
    <div class="px-4 lg:px-0 py-4 space-y-6">
      <BreakingNewsBanner />
      <div class="grid lg:grid-cols-[1fr_320px] gap-8">
        <div class="space-y-6">
          <BeritaTabBar />
          <div v-if="newsItems.length > 0" class="space-y-4">
            <NuxtLink v-for="item in newsItems" :key="item.$id" :to="`/berita/${item.$id}`" class="block no-underline">
              <BeritaCard :news="item" />
            </NuxtLink>
          </div>
          <div v-else class="text-center py-20 opacity-40 italic">
            Belum ada berita yang diterbitkan.
          </div>
        </div>
          <!-- Desktop Sidebar -->
        <aside class="hidden lg:block space-y-6">
          <div class="card p-4">
            <h4 class="card-label mb-3">Pengumuman</h4>
            <div v-if="announcements.length > 0" class="space-y-2">
              <div v-for="ann in announcements" :key="ann.$id" class="p-3 bg-brand/5 rounded-lg text-xs text-brand italic">
                {{ ann.title }}
              </div>
            </div>
            <div v-else class="p-3 bg-brand/5 rounded-lg text-xs text-brand/40 italic text-center py-4">
              Tidak ada pengumuman baru.
            </div>
          </div>
          <div class="card p-4">
            <h4 class="card-label mb-3">Paling Banyak Dibaca</h4>
            <div v-if="topNews.length > 0" class="space-y-3">
              <NuxtLink v-for="(item, i) in topNews" :key="item.$id" :to="`/berita/${item.$id}`" class="flex gap-2 group no-underline">
                <span class="text-2xl font-black text-brand/20 group-hover:text-brand/40 transition-colors">{{ i + 1 }}</span>
                <p class="text-xs font-bold line-clamp-2 text-default group-hover:text-brand transition-colors">{{ item.title }}</p>
              </NuxtLink>
            </div>
            <div v-else class="text-xs text-secondary italic text-center py-4">Belum ada data.</div>
          </div>
        </aside>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
useSeoMeta({
  title: 'Berita & Informasi | Sanatana Dharma',
  ogTitle: 'Kabar Terkini Sanatana Dharma | Sanatana Dharma',
  description: 'Baca berita, pengumuman, dan artikel terbaru seputar kegiatan umat Hindu serta informasi keagamaan lainnya di platform Sanatana Dharma.',
  ogDescription: 'Baca berita, pengumuman, dan artikel terbaru seputar kegiatan umat Hindu.',
  ogImage: '/og-news.png',
  twitterCard: 'summary_large_image',
})

const { newsItems, fetchNews, subscribe: subscribeNews, stop: stopNews } = useRealtimeNews()
const { announcements, fetchAnnouncements, subscribe: subscribeAnnouncements, stop: stopAnnouncements } = useRealtimeAnnouncements()

const topNews = computed(() => newsItems.value.slice(0, 3))

onMounted(async () => {
  await Promise.all([
    fetchNews(10),
    fetchAnnouncements(3)
  ])
  subscribeNews()
  subscribeAnnouncements()
})

onUnmounted(() => {
  stopNews()
  stopAnnouncements()
})
</script>
