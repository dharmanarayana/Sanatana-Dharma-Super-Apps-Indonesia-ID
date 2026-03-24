<template>
  <div v-if="doa || loading" class="min-h-screen bg-base flex flex-col animate-fade-up">
    <!-- Sticky Header -->
    <div class="sticky top-[60px] z-30 bg-base/80 backdrop-blur-md px-4 py-4 flex items-center justify-between border-b border-default">
      <button @click="$router.back()" 
              class="hidden lg:flex p-2 -ml-2 rounded-full hover:bg-surface transition-colors items-center gap-2 text-muted hover:text-brand hover:border-brand transition-all active:scale-95">
        <Icon name="lucide:arrow-left" class="w-6 h-6" />
        <span class="text-sm font-bold">Kembali</span>
      </button>
      <div class="flex items-center gap-2 ml-auto">
        <AppSaveButton v-if="doa" :item="doa" type="prayer" :path="route.path" />
        <button @click="handleShare" class="p-2 rounded-full hover:bg-surface transition-colors">
          <Icon name="lucide:share-2" class="w-6 h-6 text-muted" />
        </button>
      </div>
    </div>

    <!-- Content Skeleton -->
    <div v-if="loading && !doa" class="px-6 py-8 space-y-8">
      <div class="text-center space-y-4 mb-10">
        <UiSkeleton height="1rem" width="30%" class="mx-auto" />
        <UiSkeleton height="3rem" width="70%" class="mx-auto" />
        <UiSkeleton height="4rem" width="100%" class="mx-auto rounded-2xl" />
      </div>
      <div v-for="i in 3" :key="i" class="space-y-4">
        <UiSkeleton height="1.5rem" width="40%" />
        <UiSkeleton height="6rem" width="100%" />
        <UiSkeleton height="4rem" width="100%" />
      </div>
    </div>

    <!-- Content -->
    <div v-else-if="doa" class="px-6 py-8 flex-grow pb-32 lg:pb-12">
      <div class="text-center mb-10">
        <div class="flex items-center justify-center gap-3 mb-2">
          <span class="text-sm font-bold uppercase tracking-[0.3em] text-brand">{{ doa.category_name || doa.category || 'Doa & Mantra' }}</span>
          <div v-if="isCached" class="flex items-center gap-1 px-2 py-0.5 bg-brand/10 rounded-full text-[10px] font-bold text-brand uppercase tracking-tighter">
            <Icon name="lucide:check-circle" size="10" />
            Tersimpan Offline
          </div>
        </div>
        <h1 class="font-serif text-3xl font-bold text-default leading-tight">{{ doa.title }}</h1>
        
        <!-- Penjelasan/Khasiat Doa -->
        <div class="mt-6 p-4 bg-brand/5 rounded-2xl border border-brand/10 mx-auto max-w-lg">
          <p class="text-default text-base leading-relaxed italic opacity-80">
            "{{ prayerExplanation }}"
          </p>
        </div>
      </div>

      <div class="space-y-12">
        <div v-for="(section, idx) in doa.content" :key="idx" class="relative">
          <div class="absolute -left-4 top-0 h-full w-1 bg-brand/10 rounded-full"></div>
          
          <h3 class="font-bold text-brand text-sm uppercase tracking-widest mb-4 flex items-center gap-2">
            <span class="w-6 h-6 rounded-full bg-brand text-inverse flex items-center justify-center text-xs">{{ (idx as number) + 1 }}</span>
            {{ doa.content.length > 1 ? 'Bait ' + ((idx as number) + 1) : 'Isi Mantra' }}
          </h3>

          <div class="space-y-6">
            <!-- Sansekerta -->
            <p v-if="section.sanskrit" class="font-serif text-2xl font-bold text-brand text-center leading-relaxed italic">
              {{ section.sanskrit }}
            </p>
            
            <!-- Transliterasi -->
            <p v-if="section.transliteration" class="text-lg text-default text-center leading-loose font-medium opacity-90">
              {{ section.transliteration }}
            </p>
            
            <!-- Terjemahan -->
            <div v-if="section.translation" class="bg-surface/50 p-6 rounded-xl border border-default shadow-sm text-default">
              <p class="text-base text-muted leading-relaxed text-center">
                <span class="font-bold block mb-2 text-default text-sm">Artinya:</span>
                {{ section.translation }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Audio Player (Floating) -->
    <div v-if="doa?.audioUrl" 
         class="fixed bottom-24 left-6 right-6 lg:left-auto lg:right-10 lg:w-[400px] lg:bottom-10 z-40 animate-fade-in-up">
      <div class="bg-elevated/95 backdrop-blur-sm text-default p-4 rounded-2xl shadow-2xl flex items-center gap-4 border border-default ring-1 ring-black/5">
        <button @click="isPlaying = !isPlaying" class="w-12 h-12 rounded-xl bg-brand flex items-center justify-center active:scale-95 transition-all">
          <Icon :name="isPlaying ? 'lucide:pause' : 'lucide:play'" class="w-6 h-6 text-inverse" />
        </button>
        <div class="flex-grow">
          <p class="text-xs font-bold uppercase tracking-widest text-brand mb-1">Dengarkan Audio</p>
          <div class="h-1 bg-default/10 rounded-full overflow-hidden">
            <div class="h-full bg-brand w-1/3"></div>
          </div>
        </div>
        <Icon name="lucide:volume-2" class="w-5 h-5 text-muted" />
      </div>
    </div>
  </div>
  <div v-else class="min-h-screen flex items-center justify-center">
    <div class="text-center opacity-40">
      <Icon name="lucide:file-question" size="48" class="mx-auto mb-2" />
      <p>Doa tidak ditemukan atau Anda sedang offline.</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useDoaStore } from '~/stores/doa.store'

const route = useRoute()
const doaStore = useDoaStore()
const isPlaying = ref(false)
const isBookmarked = ref(false)

const isCached = computed(() => !!doaStore.doaDetails[route.params.id as string])

const prayerExplanation = computed(() => {
  if (!doa.value) return ''
  const title = doa.value.title.toLowerCase()
  
  if (title.includes('kesehatan')) return 'Doa ini dipanjatkan untuk memohon kesehatan lahir dan batin, serta perlindungan dari segala jenis penyakit bagi diri sendiri maupun keluarga.'
  if (title.includes('bangun pagi')) return 'Diucapkan sebagai wujud syukur atas kesempatan hidup yang baru dan memohon bimbingan Tuhan sepanjang hari agar penuh berkah.'
  if (title.includes('makan')) return 'Sebagai rasa syukur atas karunia makanan yang menjadi sumber energi hidup, serta memohon agar makanan tersebut memberikan kesehatan dan kemurnian jiwa.'
  if (title.includes('belajar') || title.includes('cerdas') || title.includes('inspirasi')) return 'Memohon tuntunan Dewi Saraswati agar diberikan kecerlangan pikiran, kemudahan dalam menyerap ilmu, dan kejernihan intelektual.'
  if (title.includes('tidur')) return 'Memohon perlindungan selama istirahat malam agar terhindar dari mimpi buruk dan diberikan kesegaran saat bangun kembali.'
  if (title.includes('kerja')) return 'Memohon agar segala rintangan dalam pekerjaan dihilangkan dan segala usaha membuahkan hasil yang bermanfaat bagi sesama.'
  if (title.includes('ampun')) return 'Sebagai bentuk penyerahan diri dan permohonan maaf atas segala kesalahan pikiran, perkataan, maupun perbuatan yang tidak sengaja dilakukan.'
  if (title.includes('perjalanan') || title.includes('selamat')) return 'Memohon perlindungan selama di perjalanan agar terhindar dari bahaya dan sampai di tujuan dengan selamat.'
  if (title.includes('takut')) return 'Untuk memberikan ketenangan hati dan perlindungan spiritual saat merasa cemas atau menghadapi situasi yang menakutkan.'
  if (title.includes('sembah') || title.includes('panca')) return 'Bagian dari urutan pemujaan suci untuk menyucikan diri dan menghubungkan atma dengan Paramatma (Tuhan) dalam ketulusan.'
  
  return 'Mantra suci ini berisi pemujaan dan permohonan tulus kepada Ida Sang Hyang Widhi Wasa untuk mendatangkan kedamaian, tuntunan, dan keberkahan dalam setiap langkah kehidupan.'
})

const parseContent = (doc: any) => {
  if (Array.isArray(doc.content)) return doc.content;
  if (typeof doc.content === 'string' && doc.content.trim().startsWith('[')) {
    try { return JSON.parse(doc.content) } catch (e) {}
  }
  return [{ sanskrit: '', transliteration: doc.transliteration || '', translation: doc.content || '' }]
}

const { data: doa, pending: loading } = await useAsyncData(`prayer-${route.params.id}`, async () => {
  // 1. First check the store (offline-first)
  const cached = doaStore.getDoaBySlug(route.params.id as string)
  if (cached && !navigator.onLine) {
    return cached
  }

  try {
    const { $appwrite } = useNuxtApp()
    const prayersData = (await import('~/data/prayers.json')).default
    let localItem = prayersData.find((d: any) => d.slug === route.params.id)
    
    let appDoc = null;
    try {
      const res = await $appwrite.databases.listDocuments('sanatana-dharma-db', 'prayers', [
          useAppwriteQuery().equal('slug', route.params.id as string)
      ])
      if (res.documents.length > 0) {
          appDoc = res.documents[0]
      }
    } catch(err) {}

    if (!localItem && !appDoc) return cached || null

    // Merge logic
    const finalDoa = localItem ? { ...localItem } : {} as any
    if (appDoc) {
      Object.assign(finalDoa, {
        ...appDoc,
        category: appDoc.category_name || (appDoc.category_id ? 'Kategori ' + appDoc.category_id : 'Lainnya'),
        content: parseContent(appDoc)
      })
    } else if (localItem) {
      finalDoa.category = localItem.category_name
    }

    // Cache to store for future offline use
    doaStore.setDoaDetail(route.params.id as string, finalDoa)
    return finalDoa
  } catch (e) {
    console.warn('Error loading prayer detail, falling back to cache:', e)
    return cached || null
  }
})

// Set SEO metadata at top level for SSR using computed
const metaTitle = computed(() => doa.value?.title || 'Doa & Mantra')
const metaDesc = computed(() => doa.value ? `Baca ${doa.value.title} (${doa.value.category}). Tersedia teks Sansekerta, transliterasi, dan terjemahan bahasa Indonesia lengkap.` : 'Daftar doa dan mantra Hindu.')
const metaImage = computed(() => '/og-doa.png')

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

if (doa.value) {
  useBreadcrumbs().setBreadcrumbLabel(route.params.id as string, doa.value.title)
}

const handleShare = async () => {
  if (navigator.share && doa.value) {
    await navigator.share({
      title: doa.value.title,
      text: `Mari kita membaca ${doa.value.title} hari ini.`,
      url: window.location.href
    })
  }
}
</script>
