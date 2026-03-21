<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <h1 class="text-2xl font-bold text-default">Manajemen Doa & Mantra</h1>
      <nuxt-link to="/admin" class="text-brand-primary font-medium hover:underline flex items-center gap-1">
        <Icon name="lucide:arrow-left" size="18" />
        Kembali ke Dashboard
      </nuxt-link>
    </div>

    <AdminCrudTable 
      title="Doa"
      :items="items"
      :columns="columns"
      @add="handleAdd"
      @edit="handleEdit"
      @delete="handleDelete"
    />

    <AdminCrudForm 
      :show="showForm"
      title="Doa"
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
const COLL_ID = 'prayers'

const items = ref<any[]>([])
const showForm = ref(false)
const editingItem = ref<any>(null)

const columns = [
  { key: 'title', label: 'Judul Doa' },
  { key: 'category', label: 'Kategori' },
]

const fields = [
  { key: 'title', label: 'Judul Doa/Mantra', required: true, placeholder: 'Contoh: Mantram Gayatri' },
  { key: 'category', label: 'Kategori', required: true, type: 'select', options: [
    { label: 'Harian', value: 'Harian' },
    { label: 'Pemujaan', value: 'Pemujaan' },
    { label: 'Upacara', value: 'Upacara' },
    { label: 'Lainnya', value: 'Lainnya' },
  ]},
  { key: 'content', label: 'Teks Mantram', type: 'textarea', required: true, placeholder: 'Masukkan teks doa...' },
  { key: 'transliteration', label: 'Transliterasi / Cara Baca', type: 'textarea', placeholder: 'Teks cara baca...' },
  { key: 'audioUrl', label: 'URL Audio (Opsional)', placeholder: 'https://...' },
]

const fetchData = async () => {
  try {
    const res = await $appwrite.databases.listDocuments(DB_ID, COLL_ID)
    items.value = res.documents
  } catch (e: any) {
    console.error('Error fetching prayers:', e.message)
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
  if (confirm(`Hapus doa "${item.title}"?`)) {
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
