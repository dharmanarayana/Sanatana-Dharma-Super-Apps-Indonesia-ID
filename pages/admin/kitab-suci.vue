<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <h1 class="text-2xl font-bold text-default">Manajemen Kitab Suci</h1>
      <nuxt-link to="/admin" class="text-brand-primary font-medium hover:underline flex items-center gap-1">
        <Icon name="lucide:arrow-left" size="18" />
        Kembali ke Dashboard
      </nuxt-link>
    </div>

    <AdminCrudTable 
      title="Kitab Suci"
      :items="items"
      :columns="columns"
      @add="handleAdd"
      @edit="handleEdit"
      @delete="handleDelete"
    />

    <AdminCrudForm 
      :show="showForm"
      title="Kitab Suci"
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
const COLL_ID = 'holy_books'

const items = ref<any[]>([])
const showForm = ref(false)
const editingItem = ref<any>(null)

const columns = [
  { key: 'title', label: 'Judul Kitab' },
  { key: 'category', label: 'Kategori' },
]

const fields = [
  { key: 'title', label: 'Judul Kitab', required: true, placeholder: 'Contoh: Bhagavad Gita' },
  { key: 'category', label: 'Kategori', required: true, type: 'select', options: [
    { label: 'Weda', value: 'Weda' },
    { label: 'Upanisad', value: 'Upanisad' },
    { label: 'Itihasa', value: 'Itihasa' },
    { label: 'Purana', value: 'Purana' },
    { label: 'Lainnya', value: 'Lainnya' },
  ]},
  { key: 'coverImage', label: 'URL Sampul Kitab', placeholder: 'https://...' },
  { key: 'description', label: 'Deskripsi / Pengantar', type: 'textarea', placeholder: 'Keterangan isi kitab...' },
]

const fetchData = async () => {
  try {
    const res = await $appwrite.databases.listDocuments(DB_ID, COLL_ID)
    items.value = res.documents
  } catch (e: any) {
    console.error('Error fetching books:', e.message)
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
  if (confirm(`Hapus kitab "${item.title}"?`)) {
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
