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
            <div class="p-3 bg-brand/5 rounded-lg text-xs text-brand italic">
              Jadwal Pujawali Pura Besakih telah diperbarui. Cek di menu Kalender.
            </div>
          </div>
          <div class="card p-4">
            <h4 class="card-label mb-3">Paling Banyak Dibaca</h4>
            <div class="space-y-3">
              <div v-for="i in 3" :key="i" class="flex gap-2">
                <span class="text-2xl font-black text-brand/20">{{ i }}</span>
                <p class="text-xs font-bold line-clamp-2">Makna Mendalam Hari Raya Nyepi Bagi Umat Hindu</p>
              </div>
            </div>
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

const { $appwrite } = useNuxtApp()
const DB_ID = 'sanatana-dharma-db'
const newsItems = ref<any[]>([])

const fetchNews = async () => {
  try {
    const res = await $appwrite.databases.listDocuments(DB_ID, 'news', [
      useAppwriteQuery().orderDesc('$createdAt')
    ])
    newsItems.value = res.documents
  } catch (e: any) {
    console.error('Error fetching news:', e.message)
  }
}

onMounted(fetchNews)
</script>
