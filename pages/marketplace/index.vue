<template>
  <div>
    <UiPageHeader icon="🛍️" title="Marketplace"
                  subtitle="Lengkapi kebutuhan ritual Anda"
                  back-path="/" />
    <div class="px-4 lg:px-0 py-4 grid lg:grid-cols-[240px_1fr] gap-8">
      <!-- Filter Sidebar Desktop -->
      <aside class="hidden lg:block space-y-6">
        <div class="card p-4">
          <h4 class="card-label mb-3 text-muted text-[10px]">Kategori Belanja</h4>
          <div class="space-y-2">
            <label v-for="c in categories" :key="c"
                   class="flex items-center gap-2 text-xs font-medium cursor-pointer hover:text-brand transition-colors">
              <input type="checkbox" class="rounded border-default text-brand focus:ring-brand" />
              {{ c }}
            </label>
          </div>
        </div>
      </aside>
      
      <div class="space-y-6">
        <div class="relative">
          <input v-model="searchQuery" type="text" placeholder="Cari produk ritual (Dupa, Bunga, dll)..." 
                 class="input-field pl-10 h-12 shadow-sm focus:shadow-md transition-shadow" />
          <span class="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted opacity-50">🔍</span>
        </div>

        <div v-if="filteredProducts.length > 0">
          <div class="flex items-center justify-between mb-4 border-b border-default pb-2">
             <p class="text-[10px] font-bold text-muted uppercase tracking-wider">Menampilkan {{ filteredProducts.length }} Produk</p>
             <button class="text-[10px] font-bold text-brand uppercase">Urutan Terbaru ▾</button>
          </div>
          <UiGrid cols="4" gap="md">
            <ProdukCard v-for="p in filteredProducts" :key="p" />
          </UiGrid>
        </div>
        <div v-else class="py-20 text-center">
          <p class="text-muted italic text-sm">Produk "{{ searchQuery }}" tidak ditemukan...</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const searchQuery = ref('')
const categories = ref(['Dupa & Wangi', 'Bunga & Janur', 'Wastra & Busana', 'Kitab & Sastra', 'Genta & Alat'])
const allProducts = ref<any[]>([])

const filteredProducts = computed(() => {
  if (!searchQuery.value) return allProducts.value
  return allProducts.value.filter((p: any) => 
    p.title?.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
})
</script>
