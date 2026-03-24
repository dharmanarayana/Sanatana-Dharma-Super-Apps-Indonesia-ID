<template>
  <Transition name="fade">
    <div v-if="isVisible" class="fixed inset-0 z-[1000] flex flex-col bg-surface/95 backdrop-blur-xl" @keydown.esc="closeSearch">
      <!-- Header -->
      <div class="h-[70px] border-b border-default flex items-center px-4 gap-4 safe-top shrink-0">
        <Icon name="lucide:search" class="w-6 h-6 text-brand" />
        <input 
          ref="searchInput"
          v-model="searchQuery" 
          type="text" 
          placeholder="Cari berita, donasi, doa..." 
          class="flex-1 bg-transparent border-none outline-none text-lg font-medium text-default placeholder:text-muted h-full"
          autocomplete="off"
        />
        <button @click="closeSearch" class="p-2 hover:bg-default/5 rounded-full transition-all" aria-label="Tutup pencarian">
          <Icon name="lucide:x" class="w-6 h-6 text-muted" />
        </button>
      </div>

      <!-- Results Area -->
      <div class="flex-1 overflow-y-auto custom-scrollbar p-6">
        <div class="max-w-4xl mx-auto w-full">
          <!-- Loading State -->
          <div v-if="isLoading" class="flex flex-col items-center justify-center py-20 opacity-40">
             <Icon name="lucide:loader-2" class="w-10 h-10 animate-spin mb-4" />
             <p class="text-sm font-bold uppercase tracking-widest italic">Mencari pencerahan...</p>
          </div>

          <!-- No Results -->
          <div v-else-if="hasSearched && results.length === 0" class="text-center py-20">
             <div class="w-24 h-24 bg-brand/5 rounded-full flex items-center justify-center mx-auto mb-6">
                <Icon name="lucide:search-x" class="w-12 h-12 text-muted opacity-30" />
             </div>
             <h3 class="text-xl font-bold text-default mb-2">Tidak Ada Hasil</h3>
             <p class="text-secondary max-w-xs mx-auto text-sm">Maaf, kami tidak menemukan hasil untuk "{{ searchQuery }}". Coba gunakan kata kunci lain yang lebih umum.</p>
          </div>

          <!-- Initial State / Suggestions -->
          <div v-else-if="!hasSearched" class="space-y-12 py-6">
             <div>
                <div class="flex items-center gap-2 mb-6">
                  <div class="w-1 h-5 bg-brand rounded-full"></div>
                  <h4 class="text-xs font-black uppercase tracking-[0.2em] text-muted">Saran Pencarian</h4>
                </div>
                <div class="flex flex-wrap gap-2">
                   <button v-for="tag in quickTags" :key="tag" @click="searchQuery = tag"
                           class="px-5 py-2.5 bg-brand/5 border border-brand/10 rounded-2xl text-xs font-bold text-brand hover:bg-brand hover:text-white hover:shadow-lg hover:shadow-brand/20 transition-all active:scale-95">
                      {{ tag }}
                   </button>
                </div>
             </div>

             <div class="grid grid-cols-2 sm:grid-cols-4 gap-4">
               <div v-for="feat in categoryLinks" :key="feat.name" 
                    @click="goTo(feat.link)"
                    class="p-4 bg-surface border border-default rounded-3xl text-center group cursor-pointer hover:border-brand/40 transition-all hover:shadow-xl hover:shadow-brand/5">
                 <div class="w-12 h-12 bg-brand/5 rounded-2xl flex items-center justify-center text-2xl mx-auto mb-3 group-hover:bg-brand group-hover:text-white transition-all shadow-inner">
                   <Icon :name="feat.icon" />
                 </div>
                 <div class="text-[10px] font-bold text-default uppercase tracking-widest">{{ feat.name }}</div>
               </div>
             </div>
          </div>

          <!-- Results List -->
          <div v-else class="space-y-4">
             <div class="flex items-center justify-between mb-4 px-2">
                <h4 class="text-xs font-black uppercase tracking-widest text-muted">Hasil Pencarian ({{ results.length }})</h4>
                <span class="text-[10px] font-bold text-brand px-2 py-0.5 bg-brand/10 rounded-full">Ditemukan</span>
             </div>
             
             <div class="grid gap-3 sm:grid-cols-2">
                <NuxtLink v-for="item in results" :key="item.id" :to="item.link" @click="closeSearch"
                           class="group flex items-center gap-4 p-4 bg-surface border border-default hover:border-brand/40 rounded-3xl transition-all hover:shadow-2xl hover:shadow-brand/5 active:scale-[0.98]">
                   <div class="w-14 h-14 shrink-0 rounded-2xl overflow-hidden bg-brand/5 flex items-center justify-center text-2xl relative shadow-inner">
                      <img v-if="item.image" :src="item.image" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                      <span v-else class="group-hover:scale-110 transition-transform">{{ item.icon }}</span>
                   </div>
                   <div class="min-w-0 flex-1">
                      <div class="text-[10px] font-black uppercase tracking-widest text-brand mb-1 opacity-70">{{ item.subtitle }}</div>
                      <h4 class="font-bold text-default text-sm line-clamp-1 group-hover:text-brand transition-colors">{{ item.title }}</h4>
                   </div>
                   <Icon name="lucide:arrow-right" class="w-4 h-4 text-muted group-hover:text-brand group-hover:translate-x-1 transition-all" />
                </NuxtLink>
             </div>
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
const { isVisible, searchQuery, results, isLoading, hasSearched, closeSearch } = useGlobalSearch()
const searchInput = ref<HTMLInputElement | null>(null)
const router = useRouter()

const quickTags = ['Pura Besakih', 'Dana Punia', 'Mantram Gayatri', 'Nyepi 2026', 'Doa Tidur', 'Tri Sandya']

const categoryLinks = [
  { name: 'Berita', icon: 'lucide:newspaper', link: '/berita' },
  { name: 'Punia', icon: 'lucide:heart', link: '/punia' },
  { name: 'Doa', icon: 'lucide:scroll-text', link: '/doa-mantra' },
  { name: 'Pura', icon: 'lucide:map-pin', link: '/pura' }
]

const goTo = (link: string) => {
  closeSearch()
  router.push(link)
}

// Autofocus input when visible
watch(isVisible, (newVal) => {
  if (newVal) {
    nextTick(() => {
      searchInput.value?.focus()
    })
  }
})
</script>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1); }
.fade-enter-from, .fade-leave-to { opacity: 0; transform: translateY(-20px) scale(0.98); filter: blur(10px); }

.custom-scrollbar::-webkit-scrollbar { width: 5px; }
.custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(var(--color-brand-rgb), 0.1); border-radius: 10px; }
</style>
