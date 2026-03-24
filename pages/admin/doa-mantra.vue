<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <h1 class="text-2xl font-bold text-default">Manajemen Doa & Mantra</h1>
      <nuxt-link to="/admin" class="text-brand font-bold hover:underline flex items-center gap-1 text-sm transition-all active:scale-95">
        <Icon name="lucide:chevron-left" size="18" />
        Kembali
      </nuxt-link>
    </div>

    <AdminCrudTable 
      title="Doa"
      :items="items"
      :columns="columns"
      :disableAdd="true"
      :disableDelete="true"
      @add="handleAdd"
      @edit="handleEdit"
      @delete="handleDelete"
    >
      <template #col-audioUrl="{ item }">
        <div v-if="item.audioUrl" class="flex items-center gap-2">
          <button @click.stop="playAudio(item.audioUrl)" class="p-2 bg-brand/10 text-brand rounded-full hover:bg-brand hover:text-white transition-all">
            <Icon name="lucide:play" size="14" />
          </button>
          <span class="text-[10px] text-muted truncate max-w-[100px]">Tersedia</span>
        </div>
        <span v-else class="text-[10px] text-muted opacity-40">Tidak ada</span>
      </template>
    </AdminCrudTable>

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

const playAudio = (url: string) => {
  const audio = new Audio(url)
  audio.play()
}

const items = ref<any[]>([])
const showForm = ref(false)
const editingItem = ref<any>(null)

const columns = [
  { key: 'title', label: 'Judul Doa' },
  { key: 'category_name', label: 'Kategori' },
  { key: 'audioUrl', label: 'Audio' },
]

const fields = [
  { key: 'title', label: 'Judul Doa/Mantra', required: true, disabled: true },
  { key: 'category_id', label: 'Kategori', required: true, type: 'select', disabled: true, options: [
    { label: 'Doa Harian', value: 17 },
    { label: 'Sebelum Persembahyangan', value: 19 },
    { label: 'Kramaning Sembah / Panca Sembah', value: 20 },
    { label: 'Doa Waktu Tertentu', value: 45 },
  ]},
  { key: 'audioFile', label: 'Upload Audio (Opsional)', type: 'file', accept: 'audio/*', onChange: (e: Event, formData: any) => {
      const target = e.target as HTMLInputElement;
      if (target.files?.length) formData.audioFile = target.files[0];
      else delete formData.audioFile;
  }},
  { key: 'audioUrl', label: 'URL Audio (Eksternal, opsional)', placeholder: 'https://...' },
]

const fetchData = async () => {
  try {
    const prayersData = (await import('~/data/prayers.json')).default
    
    let appwriteData: any[] = []
    try {
      const res = await $appwrite.databases.listDocuments(DB_ID, COLL_ID)
      appwriteData = res.documents
    } catch (e: any) {
      console.error('Appwrite fetch error:', e.message)
    }

    items.value = prayersData.map((d: any) => {
      // Find matching appwrite doc by prayer_id, or string match id if previously saved that way
      const appDoc = appwriteData.find(a => Number(a.prayer_id) === Number(d.id) || a.$id === d.id.toString())
      return {
        ...d,
        appwrite_id: appDoc ? appDoc.$id : null,
        audioUrl: appDoc ? appDoc.audioUrl : null,
      }
    })
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

const catMap: Record<number, string> = {
  17: 'Doa Harian',
  19: 'Sebelum Persembahyangan',
  20: 'Kramaning Sembah / Panca Sembah',
  45: 'Doa Waktu Tertentu'
}

const handleSave = async (data: any) => {
  try {
    let finalAudioUrl = data.audioUrl

    if (data.audioFile) {
      const bucketId = 'audio'
      try {
        const uploadedFile = await $appwrite.storage.createFile(bucketId, 'unique()', data.audioFile)
        finalAudioUrl = `${useRuntimeConfig().public.appwriteEndpoint as string}/storage/buckets/${bucketId}/files/${uploadedFile.$id}/view?project=${useRuntimeConfig().public.appwriteProjectId as string}`
      } catch (err: any) {
        if (err.message.includes('Bucket not found')) {
          alert('Gagal: Bucket storage bernama "audio" belum dibuat di Appwrite. Buat bucket dengan ID "audio" dan beri permission Any untuk read.')
          return
        }
        throw err
      }
    }

    const docData: any = {
      prayer_id: Number(editingItem.value.id),
      category_id: Number(editingItem.value.category_id),
      category_name: editingItem.value.category_name || catMap[Number(editingItem.value.category_id)],
    }
    
    if (finalAudioUrl) docData.audioUrl = finalAudioUrl

    if (editingItem.value.appwrite_id) {
      await $appwrite.databases.updateDocument(DB_ID, COLL_ID, editingItem.value.appwrite_id, docData)
    } else {
      // Create new link document
      await $appwrite.databases.createDocument(DB_ID, COLL_ID, 'unique()', docData)
    }
    showForm.value = false
    await fetchData()
  } catch (e: any) {
    alert('Gagal menyimpan: ' + e.message)
  }
}

onMounted(fetchData)
</script>
