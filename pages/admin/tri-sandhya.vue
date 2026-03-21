<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <h1 class="text-2xl font-bold text-default">Manajemen Tri Sandhya</h1>
      <nuxt-link to="/admin" class="text-brand font-bold hover:underline flex items-center gap-1 text-sm transition-all active:scale-95">
        <Icon name="lucide:chevron-left" size="18" />
        Kembali
      </nuxt-link>
    </div>

    <AdminCrudTable 
      title="Bait Tri Sandhya"
      :items="items"
      :columns="columns"
      @add="handleAdd"
      @edit="handleEdit"
      @delete="handleDelete"
    />

    <AdminCrudForm 
      :show="showForm"
      title="Bait Tri Sandhya"
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
const COLL_ID = 'trisandhya'

const items = ref<any[]>([])
const showForm = ref(false)
const editingItem = ref<any>(null)

const columns = [
  { key: 'verse', label: 'Bait' },
  { key: 'content', label: 'Teks Mantram' },
]

const fields = [
  { key: 'verse', label: 'Urutan Bait', type: 'number', required: true, placeholder: 'Contoh: 1' },
  { key: 'content', label: 'Teks Mantram', type: 'textarea', required: true, placeholder: 'Om Bhur Bhuvah Svah...' },
  { key: 'translation', label: 'Terjemahan', type: 'textarea', required: true, placeholder: 'Artinya...' },
  { key: 'audioUrl', label: 'URL Audio (Opsional)', placeholder: 'https://...' },
]

const fetchData = async () => {
  try {
    const res = await $appwrite.databases.listDocuments(DB_ID, COLL_ID)
    // Sort buy verse
    items.value = res.documents.sort((a, b) => a.verse - b.verse)
  } catch (e: any) {
    console.error('Error fetching trisandhya:', e.message)
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
  if (confirm(`Hapus bait ke-${item.verse}?`)) {
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
