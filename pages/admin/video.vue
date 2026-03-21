<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <h1 class="text-2xl font-bold text-default">Manajemen Video</h1>
      <nuxt-link to="/admin" class="text-brand-primary font-medium hover:underline flex items-center gap-1">
        <Icon name="lucide:arrow-left" size="18" />
        Kembali ke Dashboard
      </nuxt-link>
    </div>

    <AdminCrudTable 
      title="Video"
      :items="videos"
      :columns="columns"
      @add="handleAdd"
      @edit="handleEdit"
      @delete="handleDelete"
    >
      <template #col-url="{ value }">
        <a :href="value" target="_blank" class="text-brand-primary hover:underline flex items-center gap-1">
          <Icon name="lucide:external-link" size="14" />
          Lihat Video
        </a>
      </template>
    </AdminCrudTable>

    <AdminCrudForm 
      :show="showForm"
      title="Video"
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
const COLL_ID = 'videos'

const videos = ref<any[]>([])
const showForm = ref(false)
const editingItem = ref<any>(null)

const columns = [
  { key: 'title', label: 'Judul' },
  { key: 'category', label: 'Kategori' },
  { key: 'url', label: 'URL Video' },
]

const fields = [
  { key: 'title', label: 'Judul Video', required: true, placeholder: 'Masukkan judul video...' },
  { key: 'url', label: 'URL Video (YouTube/Vimeo)', required: true, placeholder: 'https://youtube.com/watch?v=...' },
  { key: 'category', label: 'Kategori', required: true, type: 'select', options: [
    { label: 'Edukasi', value: 'Edukasi' },
    { label: 'Ritual', value: 'Ritual' },
    { label: 'Ceramah', value: 'Ceramah' },
    { label: 'Dokumentasi', value: 'Dokumentasi' },
  ]},
  { key: 'thumbnail', label: 'URL Thumbnail (Opsional)', placeholder: 'https://...' },
  { key: 'description', label: 'Deskripsi', type: 'textarea', placeholder: 'Keterangan video...' },
]

const fetchVideos = async () => {
  try {
    const res = await $appwrite.databases.listDocuments(DB_ID, COLL_ID)
    videos.value = res.documents
  } catch (e: any) {
    console.error('Error fetching videos:', e.message)
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
  if (confirm(`Hapus video "${item.title}"?`)) {
    try {
      await $appwrite.databases.deleteDocument(DB_ID, COLL_ID, item.$id)
      await fetchVideos()
    } catch (e: any) {
      alert('Gagal menghapus: ' + e.message)
    }
  }
}

const handleSave = async (data: any) => {
  try {
    if (editingItem.value) {
      // Clean data for update (remove system fields)
      const { $id, $collectionId, $databaseId, $createdAt, $updatedAt, $permissions, ...cleanData } = data
      await $appwrite.databases.updateDocument(DB_ID, COLL_ID, editingItem.value.$id, cleanData)
    } else {
      await $appwrite.databases.createDocument(DB_ID, COLL_ID, 'unique()', data)
    }
    showForm.value = false
    await fetchVideos()
  } catch (e: any) {
    alert('Gagal menyimpan: ' + e.message)
  }
}

onMounted(fetchVideos)
</script>
