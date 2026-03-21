<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <h1 class="text-2xl font-bold text-default">Manajemen E-Library</h1>
      <nuxt-link to="/admin" class="text-brand font-bold hover:underline flex items-center gap-1 text-sm transition-all active:scale-95">
        <Icon name="lucide:chevron-left" size="18" />
        Kembali
      </nuxt-link>
    </div>

    <AdminCrudTable 
      title="E-Library"
      :items="items"
      :columns="columns"
      @add="handleAdd"
      @edit="handleEdit"
      @delete="handleDelete"
    >
      <template #col-fileUrl="{ value }">
        <a :href="value" target="_blank" class="text-brand-primary hover:underline flex items-center gap-1">
          <Icon name="lucide:download" size="14" />
          Unduh File
        </a>
      </template>
    </AdminCrudTable>

    <AdminCrudForm 
      :show="showForm"
      title="E-Library"
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
const COLL_ID = 'elibrary'

const items = ref<any[]>([])
const showForm = ref(false)
const editingItem = ref<any>(null)

const columns = [
  { key: 'title', label: 'Judul' },
  { key: 'author', label: 'Penulis' },
  { key: 'category', label: 'Kategori' },
  { key: 'fileUrl', label: 'File URL' },
]

const fields = [
  { key: 'title', label: 'Judul Buku/Dokumen', required: true, placeholder: 'Masukkan judul...' },
  { key: 'author', label: 'Penulis/Penerbit', required: true, placeholder: 'Nama penulis...' },
  { key: 'category', label: 'Kategori', required: true, type: 'select', options: [
    { label: 'Umum', value: 'Umum' },
    { label: 'Sejarah', value: 'Sejarah' },
    { label: 'Filsafat', value: 'Filsafat' },
    { label: 'Ritual', value: 'Ritual' },
  ]},
  { key: 'fileUrl', label: 'URL File (PDF/Docs)', required: true, placeholder: 'https://...' },
  { key: 'coverImage', label: 'URL Sampul Buku', placeholder: 'https://...' },
  { key: 'description', label: 'Deskripsi Singkat', type: 'textarea', placeholder: 'Keterangan isi buku...' },
]

const fetchData = async () => {
  try {
    const res = await $appwrite.databases.listDocuments(DB_ID, COLL_ID)
    items.value = res.documents
  } catch (e: any) {
    console.error('Error fetching elibrary:', e.message)
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
  if (confirm(`Hapus item "${item.title}"?`)) {
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
