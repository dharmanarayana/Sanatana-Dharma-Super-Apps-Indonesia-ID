<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <h1 class="text-2xl font-bold text-default">Manajemen Sarana Upacara</h1>
      <nuxt-link to="/admin" class="text-brand font-bold hover:underline flex items-center gap-1 text-sm transition-all active:scale-95">
        <Icon name="lucide:chevron-left" size="18" />
        Kembali
      </nuxt-link>
    </div>

    <!-- Stats or Info Panel -->
    <div class="bg-surface rounded-xl p-4 border border-default shadow-sm flex items-center gap-4">
      <div class="bg-primary/10 p-3 rounded-full text-primary">
        <Icon name="lucide:shopping-bag" class="w-6 h-6" />
      </div>
      <div>
        <p class="text-sm text-muted">Total Produk Sarana</p>
        <p class="text-2xl font-bold text-default">{{ sarenas.length }} Item</p>
      </div>
    </div>

    <AdminCrudTable 
      title="Sarana Upacara"
      :items="sarenas"
      :columns="columns"
      @add="handleAdd"
      @edit="handleEdit"
      @delete="handleDelete"
    >
      <template #col-price="{ value }">
        <span class="font-bold text-brand">{{ formatRupiah(value) }}</span>
      </template>
      <template #col-location="{ value }">
        <span class="inline-flex items-center gap-1 text-sm bg-default px-2 py-0.5 rounded-full">
          <Icon name="lucide:map-pin" class="w-3 h-3 text-muted" />
          {{ value }}
        </span>
      </template>
    </AdminCrudTable>

    <AdminCrudForm 
      :show="showForm"
      title="Sarana Upacara"
      :fields="fields"
      :item="editingItem"
      @close="showForm = false"
      @submit="handleSave"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

definePageMeta({
  layout: 'admin',
  middleware: 'admin'
})

const { $appwrite, $db } = useNuxtApp()
const DB_ID = 'sanatana-dharma-db'
const COLL_ID = 'sarana_upacara'

const sarenas = ref<any[]>([])
const showForm = ref(false)
const editingItem = ref<any>(null)

const columns = [
  { key: 'name', label: 'Nama Produk' },
  { key: 'category', label: 'Kategori' },
  { key: 'location', label: 'Lokasi' },
  { key: 'price', label: 'Harga' },
]

const fields = [
  { key: 'name', label: 'Nama Produk', required: true, placeholder: 'Contoh: Banten Pejati Lengkap' },
  { key: 'category', label: 'Kategori', required: true, type: 'select', options: [
    { label: 'Banten', value: 'Banten' },
    { label: 'Perlengkapan', value: 'Perlengkapan' },
    { label: 'Upacara', value: 'Upacara' },
    { label: 'Lainnya', value: 'Lainnya' },
  ]},
  { key: 'price', label: 'Harga (Rp)', type: 'number', required: true, placeholder: '50000' },
  { key: 'location', label: 'Lokasi Toko / Seller', required: true, placeholder: 'Contoh: Denpasar' },
  { key: 'icon', label: 'Ikon Emoji (Opsional)', placeholder: 'Contoh: 🥥' },
  { key: 'image', label: 'URL Gambar (Opsional)', placeholder: 'https://...' },
  { key: 'description', label: 'Deskripsi Produk', type: 'textarea', required: true, placeholder: 'Jelaskan isi paket atau detail produk...' },
]

const fetchSarana = async () => {
  try {
    const res = await $db.listDocuments(DB_ID, COLL_ID)
    sarenas.value = res.documents
  } catch (e: any) {
    console.error('Error fetching sarana:', e.message)
  }
}

const formatRupiah = (number: number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0
  }).format(number)
}

const handleAdd = () => {
  editingItem.value = null
  showForm.value = true
}

const handleEdit = (item: any) => {
  editingItem.value = item
  showForm.value = true
}

const handleDelete = async (item: any) => {
  if (confirm(`Hapus produk "${item.name}"?`)) {
    try {
      await $db.deleteDocument(DB_ID, COLL_ID, item.$id)
      await fetchSarana()
    } catch (e: any) {
      alert('Gagal menghapus: ' + e.message)
    }
  }
}

const handleSave = async (data: any) => {
  try {
    // Convert price safely if somehow it came as string from form
    if (data.price) data.price = Number(data.price)
    
    if (editingItem.value) {
      const { $id, $collectionId, $databaseId, $createdAt, $updatedAt, $permissions, ...cleanData } = data
      await $db.updateDocument(DB_ID, COLL_ID, editingItem.value.$id, cleanData)
    } else {
      await $db.createDocument(DB_ID, COLL_ID, 'unique()', data)
    }
    showForm.value = false
    await fetchSarana()
  } catch (e: any) {
    alert('Gagal menyimpan: ' + e.message)
  }
}

onMounted(fetchSarana)
</script>
