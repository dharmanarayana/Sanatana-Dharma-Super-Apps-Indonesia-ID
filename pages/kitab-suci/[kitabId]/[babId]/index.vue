<template>
  <div class="min-h-screen transition-colors duration-500" :class="readerBgClass">
    <!-- Floating Top Bar -->
    <div class="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 py-4 bg-transparent">
      <button @click="$router.back()" class="p-2 rounded-full bg-surface/20 backdrop-blur-md text-default border border-default/10">
        <Icon name="lucide:arrow-left" class="w-6 h-6" />
      </button>
      
      <div class="flex items-center gap-2">
        <button @click="showSettings = true" class="p-2 rounded-full bg-surface/20 backdrop-blur-md text-default border border-default/10">
          <Icon name="lucide:settings-2" class="w-6 h-6" />
        </button>
        <button @click="isBookmarked = !isBookmarked" class="p-2 rounded-full bg-surface/20 backdrop-blur-md text-brand border border-default/10">
          <Icon :name="isBookmarked ? 'lucide:bookmark-check' : 'lucide:bookmark'" class="w-6 h-6" />
        </button>
      </div>
    </div>

    <!-- Reader Content -->
    <div v-if="loadingChapter || loadingSlokas" class="flex flex-col items-center justify-center min-h-screen opacity-40">
      <Icon name="lucide:loader-2" class="w-10 h-10 animate-spin mb-4" />
      <p class="text-sm italic">Memuat sloka suci...</p>
    </div>

    <div v-else-if="chapter" class="max-w-2xl mx-auto px-6 pt-24 pb-32">
      <div class="text-center mb-16 opacity-60">
        <p class="text-[10px] uppercase font-bold tracking-[0.4em] mb-2 text-default">{{ route.params.kitabId }}</p>
        <h2 class="font-serif text-xl font-bold text-default">Bab {{ chapter.chapter_number }}: {{ chapter.title }}</h2>
      </div>

      <div v-if="slokas && slokas.length > 0" class="space-y-20">
        <div v-for="sloka in slokas" :key="sloka.$id" class="animate-fade-up">
          <div class="text-center space-y-8">
            <!-- Number -->
            <div class="flex items-center justify-center gap-4 opacity-30">
              <div class="h-px w-8 bg-default"></div>
              <span class="font-serif italic text-sm text-default">|| {{ sloka.verse_number }} ||</span>
              <div class="h-px w-8 bg-default"></div>
            </div>

            <!-- Sanskrit -->
            <p :class="fontSizeClass" class="font-serif font-bold text-brand leading-relaxed">
              {{ sloka.sanskrit }}
            </p>
            
            <!-- Transliteration -->
            <p v-if="sloka.transliteration" :class="fontSizeClassSmall" class="opacity-80 italic text-default leading-relaxed">
              {{ sloka.transliteration }}
            </p>
            
            <!-- Translation -->
            <div class="mt-10 border-t border-default/20 py-8 px-4">
              <p :class="fontSizeClassSmall" class="text-default leading-relaxed font-serif opacity-90">
                <span class="block mb-4 font-sans font-bold text-[10px] uppercase tracking-widest opacity-60 text-center">Terjemahan</span>
                "{{ sloka.translation }}"
              </p>
            </div>
            
            <!-- Commentary/Interpretation -->
            <div v-if="sloka.commentary" class="text-left bg-surface/10 p-6 rounded-2xl italic">
               <p class="text-xs text-muted leading-relaxed">
                  <span class="font-bold border-b border-brand mb-2 inline-block text-default">Tafsir:</span><br/>
                  {{ sloka.commentary }}
               </p>
            </div>
          </div>
        </div>
      </div>
      <div v-else class="text-center py-20 opacity-40 italic text-xs">
        Belum ada sloka yang terdaftar untuk bab ini.
      </div>
    </div>

    <div v-else class="flex flex-col items-center justify-center min-h-screen py-20 px-8 text-center">
      <Icon name="lucide:file-question" class="w-16 h-16 text-muted mb-4 opacity-20" />
      <h2 class="font-serif text-xl font-bold text-default mb-2">Bab tidak ditemukan</h2>
      <NuxtLink :to="`/kitab-suci/${route.params.kitabId}`" class="text-brand font-bold text-sm">Kembali ke Daftar Bab</NuxtLink>
    </div>

    <!-- Navigation Bar -->
    <div v-if="chapter" class="fixed bottom-0 left-0 right-0 p-6 flex items-center justify-between z-40 bg-gradient-to-t from-base to-transparent pointer-events-none">
      <button 
        @click="navigateToChapter(chapter.chapter_number - 1)"
        :disabled="chapter.chapter_number <= 1"
        class="bg-surface/80 backdrop-blur-md border border-default px-6 py-3 rounded-full text-default font-bold text-sm active:scale-95 transition-all pointer-events-auto disabled:opacity-30 disabled:pointer-events-none">
        Sebelumnya
      </button>
      <button 
        @click="navigateToChapter(chapter.chapter_number + 1)"
        class="bg-brand shadow-lg px-8 py-3 rounded-full text-inverse font-bold text-sm active:scale-95 transition-all pointer-events-auto">
        Berikutnya
      </button>
    </div>

    <!-- Settings Drawer -->
    <div v-if="showSettings" class="fixed inset-0 z-[100] bg-black/60 flex items-end" @click.self="showSettings = false">
      <div class="w-full bg-surface p-8 rounded-t-[32px] animate-fade-up text-default">
        <div class="w-12 h-1 bg-elevated rounded-full mx-auto mb-8"></div>
        <h3 class="font-bold text-lg mb-6">Pengaturan Baca</h3>
        
        <div class="space-y-8">
          <div>
            <p class="text-xs font-bold uppercase tracking-widest text-muted mb-4">Ukuran Font</p>
            <div class="flex gap-3">
              <button v-for="size in ['S', 'M', 'L', 'XL']" :key="size" 
                      @click="fontSize = size"
                      :class="fontSize === size ? 'bg-brand text-inverse' : 'bg-elevated text-muted'"
                      class="flex-1 py-3 font-bold rounded-xl transition-all">{{ size }}</button>
            </div>
          </div>
          
          <div>
            <p class="text-xs font-bold uppercase tracking-widest text-muted mb-4">Tema Tampilan</p>
            <div class="flex gap-3">
              <button v-for="t in themes" :key="t.name" 
                      @click="theme = t.name"
                      :class="theme === t.name ? 'ring-2 ring-brand ring-offset-2' : ''"
                      class="flex-1 py-4 font-bold rounded-xl transition-all border border-default"
                      :style="{ backgroundColor: t.bg, color: t.text }">{{ t.label }}</button>
            </div>
          </div>
        </div>
        
        <button @click="showSettings = false" class="w-full mt-8 bg-brand text-inverse py-4 rounded-xl font-bold">Simpan</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: false })

const route = useRoute()
const { $appwrite } = useNuxtApp()
const DB_ID = 'sanatana-dharma-db'

const showSettings = ref(false)
const isBookmarked = ref(false)
const fontSize = ref('M')
const theme = ref('white')

// Fetch Chapter Info
const { data: chapter, pending: loadingChapter } = await useAsyncData(`chapter-${route.params.kitabId}-${route.params.babId}`, async () => {
  try {
    // First need to get the book ID to find the correct chapter if multiple books have same bab numbers
    // But assuming babId is unique or we can filter by book slug too
    const bookRes = await $appwrite.databases.listDocuments(DB_ID, 'holy_books', [
      useAppwriteQuery().equal('slug', route.params.kitabId as string),
      useAppwriteQuery().limit(1)
    ])
    if (bookRes.documents.length === 0) return null
    const book = bookRes.documents[0]

    const res = await $appwrite.databases.listDocuments(DB_ID, 'holy_chapters', [
      useAppwriteQuery().equal('book_id', book.$id),
      useAppwriteQuery().equal('chapter_number', parseInt(route.params.babId as string)),
      useAppwriteQuery().limit(1)
    ])
    return res.documents.length > 0 ? res.documents[0] : null
  } catch (e: any) {
    console.error('Error fetching chapter:', e.message)
    return null
  }
})

// Fetch Slokas
const { data: slokas, pending: loadingSlokas } = await useAsyncData(`slokas-${route.params.kitabId}-${route.params.babId}`, async () => {
  if (!chapter.value) return []
  try {
    const res = await $appwrite.databases.listDocuments(DB_ID, 'holy_verses', [
      useAppwriteQuery().equal('chapter_id', chapter.value.$id),
      useAppwriteQuery().orderAsc('verse_number'),
      useAppwriteQuery().limit(100)
    ])
    return res.documents
  } catch (e: any) {
    console.error('Error fetching slokas:', e.message)
    return []
  }
})

const themes = [
  { name: 'white', label: 'Putih', bg: '#FFF8F0', text: '#2D2D2D' },
  { name: 'sepia', label: 'Sepia', bg: '#f4ecd8', text: '#5b4636' },
  { name: 'dark', label: 'Gelap', bg: '#1A1A1A', text: '#F0E8D8' },
]

const readerBgClass = computed(() => {
  if (theme.value === 'sepia') return 'bg-[#f4ecd8]'
  if (theme.value === 'dark') return 'bg-[#1A1A1A]'
  return 'bg-[#FFF8F0]'
})

const fontSizeClass = computed(() => {
  const sizes: Record<string, string> = { S: 'text-xl', M: 'text-2xl', L: 'text-3xl', XL: 'text-4xl' }
  return sizes[fontSize.value] || 'text-2xl'
})

const fontSizeClassSmall = computed(() => {
  const sizes: Record<string, string> = { S: 'text-xs', M: 'text-sm', L: 'text-base', XL: 'text-lg' }
  return sizes[fontSize.value] || 'text-sm'
})

// SEO Meta
const metaTitle = computed(() => chapter.value ? `${chapter.value.title} - ${route.params.kitabId}` : 'Baca Kitab Suci')
useSeoMeta({
  title: metaTitle,
  ogTitle: metaTitle,
  description: `Baca sloka dan terjemahan ${metaTitle.value} di Sanatana Dharma Digital.`,
})

const navigateToChapter = (num: number) => {
  if (num < 1) return
  navigateTo(`/kitab-suci/${route.params.kitabId}/${num}`)
}
</script>
