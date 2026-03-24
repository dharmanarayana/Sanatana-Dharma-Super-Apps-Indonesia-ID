<script setup lang="ts">
definePageMeta({
  layout: 'merchant',
  middleware: 'merchant'
})

const { $appwrite } = useNuxtApp()
const authStore = useAuthStore()

const DB_ID = 'sanatana-dharma-db'
const COLL_ID = 'sarana_upacara'

const isLoading = ref(true)
const products = ref<any[]>([])

// Fetch only products belonging to this merchant
// Note: In a real app, you'd filter by merchantId field in Appwrite
const fetchMyProducts = async () => {
  try {
    isLoading.value = true
    const res = await $appwrite.databases.listDocuments(DB_ID, COLL_ID)
    // Placeholder filtering: showing all for now as there's no merchantId field yet
    products.value = res.documents
  } catch (error) {
    console.error('Failed to fetch merchant products:', error)
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  fetchMyProducts()
})
</script>

<template>
  <div class="space-y-8">
    <div class="flex items-center justify-between">
      <div>
        <h2 class="text-2xl font-bold text-default font-serif">Produk Saya</h2>
        <p class="text-muted">Kelola katalog sarana upacara yang Anda jual.</p>
      </div>
      <button class="bg-brand text-white px-6 py-2.5 rounded-xl font-bold text-sm shadow-lg shadow-brand/20 active:scale-95 transition-all flex items-center gap-2">
        <Icon name="lucide:plus" class="w-4 h-4" />
        Tambah Produk Baru
      </button>
    </div>

    <!-- Product Table -->
    <div class="bg-surface rounded-2xl border border-default overflow-hidden shadow-sm">
      <div v-if="isLoading" class="p-20 flex justify-center">
        <Icon name="lucide:loader-2" class="w-10 h-10 animate-spin text-brand" />
      </div>
      <table v-else class="w-full text-left">
        <thead>
          <tr class="bg-default/5 text-[10px] uppercase tracking-widest font-extrabold text-muted border-b border-default">
            <th class="px-6 py-4">Produk</th>
            <th class="px-6 py-4">Kategori</th>
            <th class="px-6 py-4">Harga</th>
            <th class="px-6 py-4">Status</th>
            <th class="px-6 py-4 text-right">Aksi</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-default">
          <tr v-for="p in products" :key="p.$id" class="hover:bg-default/5 transition-colors group">
            <td class="px-6 py-4">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center overflow-hidden border border-default shrink-0">
                  <img v-if="p.image" :src="p.image" class="w-full h-full object-cover" />
                  <span v-else class="text-lg">{{ p.icon || '🛍️' }}</span>
                </div>
                <div>
                    <p class="font-bold text-sm text-default leading-tight">{{ p.name }}</p>
                    <p class="text-[10px] text-muted">{{ p.location }}</p>
                </div>
              </div>
            </td>
            <td class="px-6 py-4">
               <span class="px-2.5 py-1 rounded-full text-[10px] font-bold bg-brand/10 text-brand">
                  {{ p.category }}
               </span>
            </td>
            <td class="px-6 py-4 font-bold text-sm">Rp {{ p.price?.toLocaleString('id-ID') }}</td>
            <td class="px-6 py-4">
               <div class="flex items-center gap-1.5 text-green-500 font-bold text-[10px]">
                  <span class="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                  Aktif
               </div>
            </td>
            <td class="px-6 py-4 text-right">
              <div class="flex items-center justify-end gap-2">
                <button class="p-2 hover:bg-brand/10 hover:text-brand rounded-lg transition-colors text-muted" title="Edit">
                  <Icon name="lucide:pencil" class="w-4 h-4" />
                </button>
                <button class="p-2 hover:bg-red-50 hover:text-red-500 rounded-lg transition-colors text-muted" title="Hapus">
                  <Icon name="lucide:trash-2" class="w-4 h-4" />
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>

      <div v-if="!isLoading && products.length === 0" class="p-20 text-center opacity-40">
           <Icon name="lucide:package-open" class="w-12 h-12 mx-auto mb-2" />
           <p class="text-sm font-medium">Belum ada produk yang ditambahkan.</p>
      </div>
    </div>
  </div>
</template>
