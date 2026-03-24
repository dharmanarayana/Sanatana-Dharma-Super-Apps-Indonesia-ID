<template>
  <div>
    <UiPageHeader 
      icon="🔖" 
      title="Tersimpan" 
      subtitle="Kumpulan konten favorit Anda" 
      back-path="/" 
    />

    <div class="px-4 lg:px-0 py-4 space-y-6">
      <!-- Tabs / Filters -->
      <div class="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
        <button v-for="tab in tabs" :key="tab.id"
                @click="activeTab = tab.id"
                :class="['px-5 py-2 rounded-full text-sm font-bold border transition-all whitespace-nowrap',
                         activeTab === tab.id ? 'bg-brand text-white border-brand shadow-lg shadow-brand/20' : 'bg-surface border-default text-muted']">
          {{ tab.label }}
        </button>
      </div>

      <!-- Loading State -->
      <div v-if="isLoading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div v-for="i in 6" :key="i" class="h-32 bg-surface border border-default rounded-2xl animate-pulse"></div>
      </div>

      <!-- Content Grid -->
      <div v-else-if="filteredItems.length > 0">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          <NuxtLink v-for="item in filteredItems" :key="item.$id" :to="item.path" class="block no-underline">
            <!-- Dynamic Card Rendering based on type -->
            <BeritaCard v-if="item.itemType === 'news'" :news="mappedItem(item)" />
            <VideoCard v-else-if="item.itemType === 'video'" :video="mappedItem(item)" />
            <DoaMantraDoaCard v-else-if="item.itemType === 'prayer'" :doa="mappedItem(item)" />
            <KitabCard v-else-if="item.itemType === 'scripture'" :kitab="mappedItem(item)" />
          </NuxtLink>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else class="text-center py-24 px-6 flex flex-col items-center">
        <div class="w-20 h-20 rounded-full bg-brand/5 flex items-center justify-center mb-4">
          <Icon name="lucide:bookmark-x" class="w-10 h-10 text-brand/30" />
        </div>
        <h3 class="text-xl font-bold text-default mb-2">Belum ada yang disimpan</h3>
        <p class="text-sm text-muted max-w-xs mx-auto">
          Klik ikon bookmark pada berita, video, doa, atau kitab suci untuk menyimpannya di sini.
        </p>
        <NuxtLink to="/" class="btn-primary mt-8 px-8">
          Jelajahi Konten
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useSavedItems } from '~/composables/useSavedItems'

definePageMeta({
  middleware: 'auth'
})

useSeoMeta({
  title: 'Konten Tersimpan',
})

const { savedItems, isLoading, fetchSavedItems } = useSavedItems()
const activeTab = ref('all')

const tabs = [
  { id: 'all', label: 'Semua' },
  { id: 'news', label: 'Berita' },
  { id: 'video', label: 'Video' },
  { id: 'prayer', label: 'Doa' },
  { id: 'scripture', label: 'Kitab' },
]

const filteredItems = computed(() => {
  if (activeTab.value === 'all') return savedItems.value
  return savedItems.value.filter(item => item.itemType === activeTab.value)
})

const mappedItem = (saveDoc: any) => {
  // Map saved_items doc back to the format expected by cards
  return {
    $id: saveDoc.itemId,
    id: saveDoc.itemId,
    title: saveDoc.title,
    image: saveDoc.image,
    thumbnail: saveDoc.image,
    category: saveDoc.itemType.toUpperCase(),
    slug: saveDoc.path.split('/').pop() || '',
    path: saveDoc.path
  }
}

onMounted(() => {
  fetchSavedItems()
})
</script>
