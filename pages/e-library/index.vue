<template>
  <div>
    <UiPageHeader icon="📚" title="E-Library"
                  subtitle="Gudang ilmu spiritual dalam genggaman"
                  back-path="/" />
    <div class="px-4 lg:px-0 py-4 space-y-6">
      <div class="flex flex-col sm:flex-row gap-4">
        <div class="relative flex-1">
          <input type="text" v-model="searchQuery" placeholder="Cari artikel atau PDF..." class="input-field pl-10 h-12" />
          <Icon name="lucide:search" class="absolute left-3 top-1/2 -translate-y-1/2 opacity-30" />
        </div>
      </div>
      
      <UiGrid v-if="filteredItems.length > 0" cols="2" gap="md">
        <ArtikelCard v-for="item in filteredItems" :key="item.$id" :item="item" />
      </UiGrid>
      <div v-else class="text-center py-20 opacity-40 italic">
        Belum ada koleksi di perpustakaan digital ini.
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const { $appwrite } = useNuxtApp()
const DB_ID = 'sanatana-dharma-db'
const items = ref<any[]>([])
const searchQuery = ref('')

const fetchItems = async () => {
  try {
    const res = await $appwrite.databases.listDocuments(DB_ID, 'elibrary', [
      useAppwriteQuery().orderDesc('$createdAt')
    ])
    items.value = res.documents
  } catch (e: any) {
    console.error('Error fetching elibrary:', e.message)
  }
}

const filteredItems = computed(() => {
  if (!searchQuery.value) return items.value
  return items.value.filter(i => 
    i.title.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
    i.author.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
})

onMounted(fetchItems)
</script>
