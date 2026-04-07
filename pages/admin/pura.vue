<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <h1 class="text-2xl font-bold text-default">Manajemen Pura</h1>
      <div class="flex items-center gap-4">
        <button 
          v-if="items.length === 0" 
          @click="seedData" 
          :disabled="isSeeding"
          class="btn-primary"
        >
          <Icon name="lucide:database" :class="{ 'animate-spin': isSeeding }" />
          {{ isSeeding ? 'Menyuntik Data...' : 'Seed dari JSON' }}
        </button>
        <nuxt-link to="/admin" class="text-brand font-bold hover:underline flex items-center gap-1 text-sm transition-all active:scale-95">
          <Icon name="lucide:chevron-left" size="18" />
          Kembali
        </nuxt-link>
      </div>
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

import templesJson from '~/data/temples.json'
import { Permission, Role } from 'appwrite'

const { $appwrite, $db } = useNuxtApp()
const DB_ID = 'sanatana-dharma-db'
const COLL_ID = 'temples'

const items = ref<any[]>([])
const showForm = ref(false)
const editingItem = ref<any>(null)
const isSeeding = ref(false)

const columns = [
  { key: 'name', label: 'Nama Pura' },
  { key: 'city', label: 'Kota/Kabupaten' },
  { key: 'province', label: 'Provinsi' },
  { key: 'latitude', label: 'Lat' },
  { key: 'longitude', label: 'Lng' },
]

const fields = [
  { key: 'name', label: 'Nama Pura', required: true, placeholder: 'Contoh: Pura Besakih' },
  { key: 'address', label: 'Alamat (Desa/Kec.)', placeholder: 'Desa Besakih, Kec. Rendang' },
  { key: 'city', label: 'Kota/Kabupaten', required: true, placeholder: 'Kab. Karangasem' },
  { key: 'province', label: 'Provinsi', required: true, placeholder: 'Bali' },
  { key: 'latitude', label: 'Latitude', type: 'number', placeholder: '-8.12345' },
  { key: 'longitude', label: 'Longitude', type: 'number', placeholder: '115.12345' },
  { key: 'image', label: 'URL Gambar Pura', placeholder: 'https://...' },
  { key: 'description', label: 'Deskripsi Singkat', type: 'textarea', placeholder: 'Keterangan tentang pura...' },
  { key: 'history', label: 'Sejarah Pura', type: 'textarea', placeholder: 'Tulis sejarah lengkap pura di sini...' },
]

const fetchData = async () => {
  try {
    const res = await $db.listDocuments(DB_ID, COLL_ID, [
      useAppwriteQuery().orderAsc('name'),
      useAppwriteQuery().limit(100)
    ])
    items.value = res.documents
  } catch (e: any) {
    console.error('Error fetching temples:', e.message)
  }
}

const seedData = async () => {
  if (!confirm('Apakah Anda yakin ingin melakukan import data Pura bawaan ke Appwrite?')) return
  
  isSeeding.value = true
  try {
    const perms = [
      Permission.read(Role.any()),
      Permission.write(Role.users()),
      Permission.delete(Role.users()),
    ]
    for (const pura of templesJson) {
      await $db.createDocument(DB_ID, COLL_ID, 'unique()', {
        name: pura.name,
        address: pura.address || '',
        city: pura.city || '',
        province: pura.province || '',
        image: pura.image || '',
        description: pura.description || '',
        history: pura.history || ''
      })
    }
    alert(`Berhasil mengimpor ${templesJson.length} pura!`)
    await fetchData()
  } catch (err: any) {
    alert('Terjadi kesalahan saat import: ' + err.message)
  } finally {
    isSeeding.value = false
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
      await $db.deleteDocument(DB_ID, COLL_ID, item.$id)
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
      await $db.updateDocument(DB_ID, COLL_ID, editingItem.value.$id, cleanData)
    } else {
      await $db.createDocument(DB_ID, COLL_ID, 'unique()', data)
    }
    showForm.value = false
    await fetchData()
  } catch (e: any) {
    alert('Gagal menyimpan: ' + e.message)
  }
}

onMounted(fetchData)
</script>
