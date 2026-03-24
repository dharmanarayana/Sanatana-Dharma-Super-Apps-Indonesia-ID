<template>
  <div>
    <UiPageHeader icon="🙏" title="Doa & Mantra"
                  subtitle="Kumpulan doa lengkap Hindu"
                  back-path="/" />
    <div class="px-4 lg:px-0 py-4 space-y-4">
      <div v-if="selectedCategory" class="flex items-center justify-between">
        <button @click="selectedCategory = null" 
                class="flex items-center gap-2 px-3 py-1.5 bg-surface border border-default rounded-lg text-sm font-bold text-muted hover:text-brand hover:border-brand transition-all active:scale-95">
          <Icon name="lucide:chevron-left" size="18" />
          Ganti Kategori
        </button>
        <div class="text-xs font-bold uppercase tracking-widest text-brand">
          {{ selectedCategory }}
        </div>
      </div>

      <div class="relative">
        <input type="text" v-model="searchQuery" placeholder="Cari doa atau mantra..." class="input-field pl-10 h-12" />
        <Icon name="lucide:search" class="absolute left-3 top-1/2 -translate-y-1/2 opacity-30" />
      </div>

      <div v-if="!selectedCategory" class="space-y-4">
        <h3 class="text-sm font-bold uppercase tracking-widest text-muted px-1">Pilih Kategori</h3>
        <div class="grid grid-cols-1 gap-3">
          <button v-for="cat in categories" :key="cat"
                  @click="selectedCategory = cat"
                  class="flex items-center justify-between p-4 bg-surface border border-default rounded-2xl hover:border-brand hover:bg-brand/5 transition-all text-left group active:scale-[0.98]">
            <div class="flex items-center gap-4">
              <div class="w-12 h-12 rounded-xl bg-brand/5 flex items-center justify-center text-brand group-hover:bg-brand group-hover:text-white transition-all">
                <Icon :name="cat === 'Semua' ? 'lucide:layers' : 'lucide:scroll-text'" size="24" />
              </div>
              <div>
                <div class="font-bold text-lg text-default leading-tight">{{ cat }}</div>
                <div class="text-xs text-muted mt-0.5">Lihat kumpulan {{ cat.toLowerCase() }}</div>
              </div>
            </div>
            <Icon name="lucide:chevron-right" size="20" class="text-muted group-hover:text-brand group-hover:translate-x-1 transition-all" />
          </button>
        </div>
      </div>

      <div v-if="selectedCategory && isLoading && filteredDoa.length === 0" class="py-20 text-center">
        <Icon name="lucide:loader-2" class="animate-spin text-brand mx-auto mb-2" size="40" />
        <p class="text-muted italic">Sinkronisasi data...</p>
      </div>

      <UiGrid v-else-if="selectedCategory && filteredDoa.length > 0" cols="2" gap="md">
        <NuxtLink v-for="doa in filteredDoa" :key="doa.$id" :to="`/doa-mantra/${doa.slug}`" class="block no-underline">
          <DoaMantraDoaCard :doa="doa" />
        </NuxtLink>
      </UiGrid>
      <div v-else-if="selectedCategory && filteredDoa.length === 0" class="text-center py-20 opacity-40 italic">
        Belum ada doa atau mantra yang terdaftar di kategori ini.
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
useSeoMeta({
  title: 'Doa & Mantra Hindu | Sanatana Dharma',
  ogTitle: 'Daftar Doa & Mantra Lengkap | Sanatana Dharma',
  description: 'Kumpulan doa dan mantra Hindu lengkap dengan aksara Sansekerta, transliterasi, dan terjemahan bahasa Indonesia hanya di Sanatana Dharma Super App.',
  ogDescription: 'Kumpulan doa dan mantra Hindu lengkap dengan aksara Sansekerta, transliterasi, dan terjemahan bahasa Indonesia.',
  ogImage: '/og-prayers.png',
  twitterCard: 'summary_large_image',
})

const { $appwrite } = useNuxtApp()
const DB_ID = 'sanatana-dharma-db'

const doaList = ref<any[]>([])
const searchQuery = ref('')
const selectedCategory = ref<string | null>(null)
const isLoading = ref(true)

const categories = computed(() => {
  const cats = new Set(doaList.value.map(d => d.category))
  return ['Semua', ...Array.from(cats)]
})

const parseContent = (doc: any) => {
  // If content is already an array (from JSON), return it
  if (Array.isArray(doc.content)) return doc.content;
  
  // If it's a JSON string from Appwrite
  if (typeof doc.content === 'string' && doc.content.trim().startsWith('[')) {
    try { return JSON.parse(doc.content) } catch (e) {}
  }
  
  // Otherwise wrap it in the expected format
  return [{
    sanskrit: '',
    transliteration: doc.transliteration || '',
    translation: doc.content || ''
  }]
}

const fetchDoa = async () => {
  isLoading.value = true
  let localData: any[] = []
  try {
    const prayersData = (await import('~/data/prayers.json')).default
    localData = prayersData.map((d: any) => ({
      ...d,
      $id: d.id.toString(),
      category: d.category_name
    }))
  } catch (e: any) {
    console.error('Error loading local prayers data:', e.message)
  }
  
  // Set initial local data first to be fast
  doaList.value = localData

  try {
    const res = await $appwrite.databases.listDocuments(DB_ID, 'prayers')
    const appwriteData = res.documents.map((d: any) => ({
      ...d,
      category: d.category_name || (d.category_id ? 'Kategori ' + d.category_id : 'Lainnya'),
      content: parseContent(d)
    }))

    // Merge Appwrite data over localData by title
    appwriteData.forEach(appDoc => {
      const existingIdx = localData.findIndex(ld => ld.title.toLowerCase().trim() === appDoc.title.toLowerCase().trim())
      if (existingIdx >= 0) {
        // Update existing record, prioritizing local metadata but taking Appwrite updates (like audioUrl)
        localData[existingIdx] = { 
          ...localData[existingIdx], 
          ...appDoc, 
          // Prefer local category unless Appwrite has a specific custom one (not the fallback)
          category: localData[existingIdx].category || appDoc.category,
          // Always preserve local content for merged items to avoid overwrite with simple strings
          content: localData[existingIdx].content 
        }
      } else {
        localData.push(appDoc)
      }
    })
    doaList.value = [...localData]
  } catch (e: any) {
    console.error('Error fetching prayers from Appwrite:', e.message)
  } finally {
    isLoading.value = false
  }
}

const filteredDoa = computed(() => {
  if (!selectedCategory.value) return []
  
  return doaList.value.filter(d => {
    const matchesSearch = d.title.toLowerCase().includes(searchQuery.value.toLowerCase())
    const matchesCategory = selectedCategory.value === 'Semua' || d.category === selectedCategory.value
    return matchesSearch && matchesCategory
  })
})

onMounted(fetchDoa)
</script>
