<template>
  <div class="animate-fade-up min-h-screen bg-base">
    <!-- Header -->
    <div class="sticky top-[60px] z-30 bg-base/80 backdrop-blur-md px-4 py-4 flex items-center justify-between border-b border-default">
      <div class="flex items-center gap-1">
        <button @click="$router.back()" class="flex items-center gap-1 p-2 -ml-2 rounded-full hover:bg-surface transition-colors text-default font-bold">
          <Icon name="lucide:chevron-left" class="w-6 h-6" />
          <span class="text-sm">Kembali</span>
        </button>
        <h2 class="font-serif font-bold text-default ml-2">Detail Kitab</h2>
      </div>
      <div class="flex items-center gap-2">
        <div v-if="isCached" class="flex items-center gap-1 px-2 py-1 bg-brand/10 rounded-full text-[9px] font-bold text-brand uppercase tracking-tighter">
          <Icon name="lucide:check-circle" size="10" />
          Offline
        </div>
        <AppSaveButton v-if="kitab" :item="{ id: kitab.$id, title: kitab.title, image: kitab.cover_image, type: 'scripture' }" type="scripture" :path="route.path" />
      </div>
    </div>

    <!-- Skeleton Loading -->
    <div v-if="(loadingKitab || loadingChapters) && !kitab" class="px-6 py-8 animate-pulse">
      <div class="flex gap-6 mb-10">
        <UiSkeleton height="160px" width="120px" class="rounded-xl flex-shrink-0" />
        <div class="flex-1 space-y-4 py-2">
          <UiSkeleton height="1rem" width="30%" />
          <UiSkeleton height="2rem" width="80%" />
          <UiSkeleton height="3rem" width="100%" />
        </div>
      </div>
      <div class="space-y-4">
        <UiSkeleton height="1.5rem" width="20%" class="mb-6" />
        <UiSkeleton v-for="i in 5" :key="i" height="70px" width="100%" class="rounded-xl" />
      </div>
    </div>

    <!-- Book Info -->
    <div v-else-if="kitab" class="px-6 py-8">
      <div class="flex gap-6 mb-10">
        <div class="w-32 aspect-[3/4] bg-brand rounded-xl shadow-lg flex-shrink-0 overflow-hidden border border-default/10">
          <img :src="kitab.cover_image || 'https://placehold.jp/24/8b0000/ffffff/300x400.png?text=' + kitab.title" 
               class="w-full h-full object-cover" />
        </div>
        <div class="flex flex-col justify-center">
          <span class="text-[10px] font-bold uppercase tracking-widest text-brand mb-2">{{ kitab.category || 'Kitab Suci' }}</span>
          <h1 class="font-serif text-2xl font-bold text-default leading-tight mb-2">{{ kitab.title }}</h1>
          <p class="text-xs text-muted leading-relaxed">{{ kitab.description }}</p>
        </div>
      </div>

      <!-- Chapter List -->
      <div class="flex items-center justify-between mb-4 border-b border-default pb-2">
        <h3 class="font-bold text-sm text-default">Daftar Bab</h3>
        <span v-if="chapters" class="text-[10px] font-bold text-muted">{{ chapters.length }} Bab</span>
      </div>

      <div v-if="loadingChapters && (!chapters || chapters.length === 0)" class="space-y-3">
        <UiSkeleton v-for="i in 5" :key="i" height="70px" width="100%" class="rounded-xl" />
      </div>

      <div v-else-if="chapters && chapters.length > 0" class="space-y-3">
        <NuxtLink v-for="bab in chapters" :key="bab.$id" :to="`/kitab-suci/${route.params.kitabId}/${bab.chapter_number}`"
                  class="bg-surface p-4 rounded-xl border border-default flex items-center justify-between group active:scale-[0.98] transition-all">
          <div class="flex items-center gap-4">
            <span class="text-xs font-bold text-muted group-hover:text-brand transition-colors">{{ bab.chapter_number }}</span>
            <div>
              <h4 class="text-sm font-bold text-default line-clamp-1">{{ bab.title }}</h4>
              <p class="text-[10px] text-muted">{{ bab.sloka_count || 0 }} Sloka</p>
            </div>
          </div>
          <Icon name="lucide:chevron-right" class="w-4 h-4 text-muted group-hover:text-brand transition-colors" />
        </NuxtLink>
      </div>
      <div v-else class="text-center py-10 opacity-40 italic text-xs">
        Belum ada bab yang terdaftar untuk kitab ini.
      </div>
    </div>

    <!-- Error/Not Found -->
    <div v-else class="flex flex-col items-center justify-center py-20 px-8 text-center">
      <div class="w-20 h-20 bg-surface rounded-full flex items-center justify-center mb-6">
        <Icon name="lucide:book-x" class="w-10 h-10 text-muted" />
      </div>
      <h2 class="font-serif text-xl font-bold text-default mb-2">Kitab Tidak Ditemukan</h2>
      <p class="text-xs text-muted mb-8">Maaf, kami tidak dapat menemukan kitab yang Anda cari.</p>
      <NuxtLink to="/kitab-suci" class="bg-brand text-inverse px-8 py-3 rounded-full font-bold text-sm">Kembali ke Perpustakaan</NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useKitabStore } from '~/stores/kitab.store'

const route = useRoute()
const kitabStore = useKitabStore()
const { $appwrite, $db } = useNuxtApp()
const DB_ID = 'sanatana-dharma-db'

// Offline status check
const isCached = computed(() => kitabStore.getBabList(route.params.kitabId as string).length > 0)

// Fetch Book Details
const { data: kitab, pending: loadingKitab } = await useAsyncData(`kitab-${route.params.kitabId}`, async () => {
  // Try store first
  const cachedKitab = kitabStore.getKitabBySlug(route.params.kitabId as string)
  if (cachedKitab && !navigator.onLine) return cachedKitab

  try {
    const res = await $db.listDocuments(DB_ID, 'holy_books', [
      useAppwriteQuery().equal('slug', route.params.kitabId as string),
      useAppwriteQuery().limit(1)
    ])
    return res.documents.length > 0 ? res.documents[0] : (cachedKitab || null)
  } catch (e: any) {
    console.warn('Holy books fetch failed, using cache if available')
    return cachedKitab || null
  }
})

// Fetch Chapters
const { data: chapters, pending: loadingChapters } = await useAsyncData(`chapters-${route.params.kitabId}`, async () => {
  if (!kitab.value) return []
  
  // Try store first
  const cachedChapters = kitabStore.getBabList(route.params.kitabId as string)
  if (cachedChapters.length > 0 && !navigator.onLine) return cachedChapters

  try {
    const res = await $db.listDocuments(DB_ID, 'holy_chapters', [
      useAppwriteQuery().equal('book_id', kitab.value.$id),
      useAppwriteQuery().orderAsc('chapter_number'),
      useAppwriteQuery().limit(100)
    ])
    
    if (res.documents.length > 0) {
      kitabStore.setBabList(route.params.kitabId as string, res.documents)
    }
    return res.documents
  } catch (e: any) {
    console.warn('Holy chapters fetch failed, using cache')
    return cachedChapters || []
  }
})

// SEO Meta
const metaTitle = computed(() => kitab.value?.title || 'Detail Kitab')
const metaDesc = computed(() => kitab.value ? `Baca ${kitab.value.title}. ${kitab.value.description}` : 'Baca kitab suci Hindu online.')

useSeoMeta({
  title: metaTitle,
  ogTitle: metaTitle,
  description: metaDesc,
  ogDescription: metaDesc,
  ogImage: kitab.value?.cover_image || '/og-scripture.png',
  ogType: 'book',
  ogSiteName: 'Sanatana Dharma Digital',
  twitterCard: 'summary_large_image',
  twitterTitle: metaTitle,
  twitterDescription: metaDesc,
})

if (kitab.value) {
  useBreadcrumbs().setBreadcrumbLabel(route.params.kitabId as string, kitab.value.title)
}

definePageMeta({ layout: 'default' })
</script>
