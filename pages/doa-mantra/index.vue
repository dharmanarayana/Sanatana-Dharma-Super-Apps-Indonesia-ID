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
                :class="['px-4 py-1.5 rounded-full text-[10px] font-bold border transition-all whitespace-nowrap',
                         selectedCategory === cat ? 'bg-brand text-white border-brand shadow-lg shadow-brand/20' : 'bg-surface border-default text-muted']">
          {{ cat }}
        </button>
      </div>

      <UiGrid v-if="filteredDoa.length > 0" cols="2" gap="md">
        <DoaCard v-for="doa in filteredDoa" :key="doa.$id" :doa="doa" />
      </UiGrid>
      <div v-else class="text-center py-20 opacity-40 italic">
        Belum ada doa atau mantra yang terdaftar.
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
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
  try {
    const res = await $appwrite.databases.listDocuments(DB_ID, 'prayers', [
      useAppwriteQuery().orderAsc('title')
    ])
    doaList.value = res.documents
  } catch (e: any) {
    console.error('Error fetching prayers:', e.message)
  }
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
