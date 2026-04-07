<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <h1 class="text-2xl font-bold text-default">Manajemen Berita</h1>
      <nuxt-link to="/admin" class="text-brand font-bold hover:underline flex items-center gap-1 text-sm transition-all active:scale-95">
        <Icon name="lucide:chevron-left" size="18" />
        Kembali
      </nuxt-link>
    </div>

    <AdminCrudTable 
      title="Berita"
      :items="news"
      :columns="columns"
      @add="handleAdd"
      @edit="handleEdit"
      @delete="handleDelete"
    >
      <template #col-publishedAt="{ value }">
        {{ new Date(value).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) }}
      </template>
    </AdminCrudTable>

    <AdminCrudForm 
      :show="showForm"
      title="Berita"
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

const { $appwrite, $db } = useNuxtApp()
const DB_ID = 'sanatana-dharma-db'
const COLL_ID = 'news'

const news = ref<any[]>([])
const showForm = ref(false)
const editingItem = ref<any>(null)

const columns = [
  { key: 'title', label: 'Judul' },
  { key: 'category', label: 'Kategori' },
  { key: 'author', label: 'Penulis' },
  { key: 'publishedAt', label: 'Tanggal Terbit' },
]

const fields = [
  { key: 'title', label: 'Judul Berita', required: true, placeholder: 'Masukkan judul berita...' },
  { key: 'author', label: 'Penulis', required: true, placeholder: 'Nama penulis...' },
  { key: 'category', label: 'Kategori', required: true, type: 'select', options: [
    { label: 'Umat', value: 'Umat' },
    { label: 'Pura', value: 'Pura' },
    { label: 'Kegiatan', value: 'Kegiatan' },
    { label: 'Warta', value: 'Warta' },
    { label: 'Pengumuman', value: 'Pengumuman' },
  ]},
  { key: 'publishedAt', label: 'Tanggal Terbit', type: 'datetime-local', required: true, default: new Date().toISOString().slice(0, 16) },
  { key: 'image', label: 'URL Gambar Utama', placeholder: 'https://...' },
  { key: 'content', label: 'Isi Berita', type: 'textarea', required: true, placeholder: 'Tulis isi berita secara lengkap...' },
]

const fetchNews = async () => {
  try {
    const res = await $db.listDocuments(DB_ID, COLL_ID)
    news.value = res.documents
  } catch (e: any) {
    console.error('Error fetching news:', e.message)
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
  if (confirm(`Hapus berita "${item.title}"?`)) {
    try {
      await $db.deleteDocument(DB_ID, COLL_ID, item.$id)
      await fetchNews()
    } catch (e: any) {
      alert('Gagal menghapus: ' + e.message)
    }
  }
}

const handleSave = async (data: any) => {
  try {
    if (editingItem.value) {
      const { $id, $collectionId, $databaseId, $createdAt, $updatedAt, $permissions, ...cleanData } = data
      await $db.updateDocument(DB_ID, COLL_ID, editingItem.value.$id, cleanData)
    } else {
      await $db.createDocument(DB_ID, COLL_ID, 'unique()', data)
    }
    showForm.value = false
    await fetchNews()
  } catch (e: any) {
    alert('Gagal menyimpan: ' + e.message)
  }
}

onMounted(fetchNews)
</script>
