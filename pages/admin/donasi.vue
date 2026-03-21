<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <h1 class="text-2xl font-bold text-default">Manajemen Donasi</h1>
      <nuxt-link to="/admin" class="text-brand-primary font-medium hover:underline flex items-center gap-1">
        <Icon name="lucide:arrow-left" size="18" />
        Kembali ke Dashboard
      </nuxt-link>
    </div>

    <AdminCrudTable 
      title="Donasi"
      :items="donations"
      :columns="columns"
      @add="handleAdd"
      @edit="handleEdit"
      @delete="handleDelete"
    >
      <template #col-target="{ value }">
        Rp {{ value.toLocaleString('id-ID') }}
      </template>
      <template #col-collected="{ value }">
        Rp {{ value.toLocaleString('id-ID') }}
      </template>
    </AdminCrudTable>

    <AdminCrudForm 
      :show="showForm"
      title="Donasi"
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
const COLL_ID = 'donations'

const donations = ref<any[]>([])
const showForm = ref(false)
const editingItem = ref<any>(null)

const columns = [
  { key: 'title', label: 'Program' },
  { key: 'category', label: 'Kategori' },
  { key: 'target', label: 'Target' },
  { key: 'collected', label: 'Terkumpul' },
]

const fields = [
  { key: 'title', label: 'Nama Program Donasi', required: true, placeholder: 'Contoh: Pembangunan Pura A' },
  { key: 'category', label: 'Kategori', required: true, type: 'select', options: [
    { label: 'Pembangunan', value: 'Pembangunan' },
    { label: 'Kemanusiaan', value: 'Kemanusiaan' },
    { label: 'Pendidikan', value: 'Pendidikan' },
    { label: 'Sosial', value: 'Sosial' },
  ]},
  { key: 'target', label: 'Target Dana (Rp)', type: 'number', required: true, placeholder: 'Contoh: 50000000' },
  { key: 'collected', label: 'Dana Terkumpul (Rp)', type: 'number', required: true, default: 0 },
  { key: 'image', label: 'URL Gambar Program', placeholder: 'https://...' },
  { key: 'qrisImage', label: 'URL Gambar QRIS (Opsional)', placeholder: 'https://...' },
  
  // Bank 1
  { key: 'bank1', label: 'Bank 1', placeholder: 'Contoh: BRI' },
  { key: 'accountName1', label: 'Atas Nama (Bank 1)', placeholder: 'Nama Pemilik Rekening' },
  { key: 'accountNumber1', label: 'No. Rekening (Bank 1)', placeholder: 'Nomor Rekening' },
  
  // Bank 2
  { key: 'bank2', label: 'Bank 2', placeholder: 'Contoh: BNI' },
  { key: 'accountName2', label: 'Atas Nama (Bank 2)', placeholder: 'Nama Pemilik Rekening' },
  { key: 'accountNumber2', label: 'No. Rekening (Bank 2)', placeholder: 'Nomor Rekening' },
  
  // Bank 3
  { key: 'bank3', label: 'Bank 3', placeholder: 'Contoh: Mandiri' },
  { key: 'accountName3', label: 'Atas Nama (Bank 3)', placeholder: 'Nama Pemilik Rekening' },
  { key: 'accountNumber3', label: 'No. Rekening (Bank 3)', placeholder: 'Nomor Rekening' },
]

const fetchDonations = async () => {
  try {
    const res = await $appwrite.databases.listDocuments(DB_ID, COLL_ID)
    donations.value = res.documents
  } catch (e: any) {
    console.error('Error fetching donations:', e.message)
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
  if (confirm(`Hapus program donasi "${item.title}"?`)) {
    try {
      await $appwrite.databases.deleteDocument(DB_ID, COLL_ID, item.$id)
      await fetchDonations()
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
    await fetchDonations()
  } catch (e: any) {
    alert('Gagal menyimpan: ' + e.message)
  }
}

onMounted(fetchDonations)
</script>
