<template>
  <div class="min-h-screen bg-base pb-20 animate-fade-up">
    <!-- Skeleton / Loading State -->
    <div v-if="loading" class="max-w-4xl mx-auto px-6 mt-10 space-y-8">
      <div class="h-8 bg-surface-variant rounded-xl w-3/4 animate-pulse"></div>
      <div class="h-[400px] bg-surface-variant rounded-3xl animate-pulse"></div>
      <div class="space-y-4">
        <div class="h-4 bg-surface-variant rounded w-full animate-pulse"></div>
        <div class="h-4 bg-surface-variant rounded w-full animate-pulse"></div>
        <div class="h-4 bg-surface-variant rounded w-2/3 animate-pulse"></div>
      </div>
    </div>

    <!-- Error / Not Found State -->
    <div v-else-if="!news" class="max-w-xl mx-auto mt-20 px-6 text-center">
      <div class="w-24 h-24 bg-brand/10 rounded-3xl flex items-center justify-center text-brand mx-auto mb-8">
        <Icon name="lucide:newspaper" size="48" />
      </div>
      <h2 class="text-3xl font-black italic tracking-tight mb-4 text-default">Berita Tidak Ditemukan</h2>
      <p class="text-muted mb-8 italic">
        Maaf, berita yang Anda cari tidak tersedia atau mungkin telah dihapus.
      </p>
      <NuxtLink to="/berita" class="btn-primary inline-flex">Kembali ke Berita</NuxtLink>
    </div>

    <!-- Article Content -->
    <template v-else>
      <!-- Header Image Section -->
      <div class="relative h-[40vh] md:h-[60vh] overflow-hidden">
        <img 
          v-if="news.image"
          :src="news.image" 
          class="w-full h-full object-cover"
        />
        <div v-else class="w-full h-full bg-brand/5 flex items-center justify-center text-brand/20">
          <Icon name="lucide:newspaper" size="120" />
        </div>
        <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
        
        <div class="absolute bottom-0 left-0 right-0 p-6 md:p-12 text-white">
          <div class="max-w-4xl mx-auto space-y-4">
            <span class="px-3 py-1 bg-brand text-white text-[10px] font-bold uppercase rounded-full tracking-wider">
              {{ news.category }}
            </span>
            <h1 class="text-3xl md:text-5xl font-black italic tracking-tighter leading-tight">
              {{ news.title }}
            </h1>
            <div class="flex flex-wrap items-center gap-4 text-white/80 text-sm">
              <div class="flex items-center gap-1.5">
                <Icon name="lucide:user" size="14" class="text-brand" />
                <span>{{ news.author }}</span>
              </div>
              <div class="flex items-center gap-1.5">
                <Icon name="lucide:calendar" size="14" class="text-brand" />
                <span>{{ formatDate(news.publishedAt) }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Article Body -->
      <div class="max-w-4xl mx-auto px-6 py-12 lg:py-20">
        <article class="prose prose-lg prose-p:text-default prose-p:leading-relaxed max-w-none">
          <div class="whitespace-pre-wrap text-default/90 leading-relaxed text-lg lg:text-xl font-medium">
            {{ news.content }}
          </div>
        </article>

        <!-- Navigation / Footer -->
        <div class="mt-16 pt-8 border-t border-default flex items-center justify-between">
          <button @click="$router.back()" class="flex items-center gap-2 text-muted hover:text-brand font-bold transition-colors">
            <Icon name="lucide:arrow-left" size="20" />
            Kembali
          </button>
          
          <div class="flex items-center gap-4">
            <AppSaveButton :item="news" type="news" :path="route.path" />
            <button @click="shareNews" class="p-3 bg-surface border border-default rounded-full hover:border-brand transition-colors text-muted hover:text-brand">
              <Icon name="lucide:share-2" size="20" />
            </button>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
const { $appwrite } = useNuxtApp()
const DB_ID = 'sanatana-dharma-db'
const COLL_ID = 'news'

const { data: news, pending: loading } = await useAsyncData(`news-${route.params.id}`, async () => {
  try {
    const { $appwrite } = useNuxtApp()
    return await $appwrite.databases.getDocument(DB_ID, COLL_ID, route.params.id as string)
  } catch (e: any) {
    console.error('Error fetching news:', e.message)
    return null
  }
})

// Set SEO metadata at top level for SSR using computed
const metaTitle = computed(() => news.value?.title || 'Berita Dharma')
const metaDesc = computed(() => news.value?.content ? (news.value.content.substring(0, 160) + '...') : 'Baca berita dan artikel dharma terbaru.')
const metaImage = computed(() => news.value?.image || '/og-berita.png')

useSeoMeta({
  title: metaTitle,
  ogTitle: metaTitle,
  description: metaDesc,
  ogDescription: metaDesc,
  ogImage: metaImage,
  ogType: 'article',
  ogSiteName: 'Sanatana Dharma Digital',
  twitterCard: 'summary_large_image',
  twitterTitle: metaTitle,
  twitterDescription: metaDesc,
  twitterImage: metaImage,
})

const formatDate = (dateStr: string) => {
  if (!dateStr) return ''
  return new Date(dateStr).toLocaleDateString('id-ID', { 
    day: 'numeric', 
    month: 'long', 
    year: 'numeric' 
  })
}

const shareNews = () => {
  if (navigator.share && news.value) {
    navigator.share({
      title: news.value.title,
      text: `Baca berita terbaru: ${news.value.title}`,
      url: window.location.href
    })
  } else {
    navigator.clipboard.writeText(window.location.href)
    alert('Link berhasil disalin!')
  }
}

// onMounted is no longer needed for initial fetch with useAsyncData

</script>

<style scoped>
/* Custom prose styles for better readability */
.prose {
  color: var(--color-default);
}
</style>
