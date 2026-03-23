<template>
  <div>
    <UiPageHeader icon="🙏" title="Doa & Mantra"
                  subtitle="Kumpulan doa lengkap Hindu"
                  back-path="/" />
    <div class="px-4 lg:px-0 py-4 space-y-4">
      <div class="relative">
        <input type="text" v-model="searchQuery" placeholder="Cari doa atau mantra..." class="input-field pl-10 h-12" />
        <Icon name="lucide:search" class="absolute left-3 top-1/2 -translate-y-1/2 opacity-30" />
      </div>

      <div class="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
        <button v-for="cat in categories" :key="cat"
                @click="selectedCategory = cat"
                :class="['px-5 py-2 rounded-full text-sm font-bold border transition-all whitespace-nowrap',
                         selectedCategory === cat ? 'bg-brand text-white border-brand shadow-lg shadow-brand/20' : 'bg-surface border-default text-muted']">
          {{ cat }}
        </button>
      </div>

      <UiGrid v-if="filteredDoa.length > 0" cols="2" gap="md">
        <NuxtLink v-for="doa in filteredDoa" :key="doa.$id" :to="`/doa-mantra/${doa.$id}`" class="block no-underline">
          <DoaMantraDoaCard :doa="doa" />
        </NuxtLink>
      </UiGrid>
      <div v-else class="text-center py-20 opacity-40 italic">
        Belum ada doa atau mantra yang terdaftar.
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// We will fetch this dynamically in fetchDoa

const { $appwrite } = useNuxtApp()
const DB_ID = 'sanatana-dharma-db'

const doaList = ref<any[]>([])
const searchQuery = ref('')
const selectedCategory = ref('Semua')

const categories = computed(() => {
  const cats = new Set(doaList.value.map(d => d.category))
  return ['Semua', ...Array.from(cats)]
})

const fetchDoa = async () => {
  // Use local data as primary source
  try {
    const prayersData = (await import('~/data/prayers.json')).default
    doaList.value = prayersData.map((d: any) => ({
      ...d,
      $id: d.id.toString(), // Map id to $id for compatibility with existing components
      category: d.category_name
    }))
  } catch (e: any) {
    console.error('Error loading local prayers data:', e.message)
  }

  /* 
  // Optional: Fallback to Appwrite if needed
  try {
    const res = await $appwrite.databases.listDocuments(DB_ID, 'prayers', [
      useAppwriteQuery().orderAsc('title')
    ])
    // Merge or prioritize Appwrite data if desired
  } catch (e: any) {
    console.error('Error fetching prayers from Appwrite:', e.message)
  }
  */
}

const filteredDoa = computed(() => {
  return doaList.value.filter(d => {
    const matchesSearch = d.title.toLowerCase().includes(searchQuery.value.toLowerCase())
    const matchesCategory = selectedCategory.value === 'Semua' || d.category === selectedCategory.value
    return matchesSearch && matchesCategory
  })
})

onMounted(fetchDoa)
</script>
