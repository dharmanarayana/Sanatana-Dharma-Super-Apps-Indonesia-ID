<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <h1 class="text-2xl font-bold text-default">Manajemen Pura</h1>
      <nuxt-link to="/admin" class="text-brand font-bold hover:underline flex items-center gap-1 text-sm transition-all active:scale-95">
        <Icon name="lucide:chevron-left" size="18" />
        Kembali
      </nuxt-link>
    </div>

    <AdminCrudTable 
      title="Pura"
      :items="items"
      :columns="columns"
      @add="handleAdd"
      @edit="handleEdit"
      @delete="handleDelete"
    />

    <AdminCrudForm 
      :show="showForm"
      title="Pura"
      :fields="fields"
      :item="editingItem"
      @close="showForm = false"
      @submit="handleSave"
    />
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'admin',
  middleware: 'admin'
})

const { $appwrite } = useNuxtApp()
const DB_ID = 'sanatana-dharma-db'
const COLL_ID = 'temples'

const items = ref<any[]>([])
const showForm = ref(false)
const editingItem = ref<any>(null)

const columns = [
  { key: 'name', label: 'Nama Pura' },
  { key: 'location', label: 'Lokasi' },
]

const fields = [
  { key: 'name', label: 'Nama Pura', required: true, placeholder: 'Contoh: Pura Besakih' },
  { key: 'location', label: 'Lokasi/Alamat', required: true, placeholder: 'Desa, Kecamatan, Kabupaten...' },
  { key: 'image', label: 'URL Gambar Pura', placeholder: 'https://...' },
  { key: 'description', label: 'Deskripsi Singkat', type: 'textarea', placeholder: 'Keterangan tentang pura...' },
  { key: 'history', label: 'Sejarah Pura', type: 'textarea', placeholder: 'Tulis sejarah lengkap pura di sini...' },
]

const fetchData = async () => {
  try {
    const res = await $appwrite.databases.listDocuments(DB_ID, COLL_ID)
    items.value = res.documents
  } catch (e: any) {
    console.error('Error fetching temples:', e.message)
  }
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
  if (confirm(`Hapus pura "${item.name}"?`)) {
    try {
      await $appwrite.databases.deleteDocument(DB_ID, COLL_ID, item.$id)
      await fetchData()
    } catch (e: any) {
      alert('Gagal menghapus: ' + e.message)
    }
  }
}

const handleSave = async (data: any) => {
  try {
    if (editingItem.value) {
      const { $id, $collectionId, $databaseId, $createdAt, $updatedAt, $permissions, ...cleanData } = data
      await $appwrite.databases.updateDocument(DB_ID, COLL_ID, editingItem.value.$id, cleanData)
    } else {
      await $appwrite.databases.createDocument(DB_ID, COLL_ID, 'unique()', data)
    }
    showForm.value = false
    await fetchData()
  } catch (e: any) {
    alert('Gagal menyimpan: ' + e.message)
  }
}

onMounted(fetchData)
</script>
