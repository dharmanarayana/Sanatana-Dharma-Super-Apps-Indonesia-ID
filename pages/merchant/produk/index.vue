<script setup lang="ts">
import { ID, Query } from 'appwrite'

definePageMeta({
  layout: 'merchant',
  middleware: 'merchant'
})

const { $appwrite } = useNuxtApp()
const authStore = useAuthStore()

const DB_ID = 'sanatana-dharma-db'
const COLL_ID = 'sarana_upacara'
const BUCKET_ID = 'sarana-images' // User must create this bucket or update ID

const isLoading = ref(true)
const isSaving = ref(false)
const showModal = ref(false)
const products = ref<any[]>([])
const editingId = ref<string | null>(null)

const categories = ['Banten', 'Perlengkapan', 'Upacara']

const form = reactive({
  name: '',
  price: 0,
  category: 'Banten',
  description: '',
  location: '',
  image: ''
})

const imageFile = ref<File | null>(null)
const imagePreview = ref('')

const onFileChange = (e: any) => {
  const file = e.target.files[0]
  if (!file) return
  imageFile.value = file
  imagePreview.value = URL.createObjectURL(file)
}

const fetchMyProducts = async () => {
  try {
    isLoading.value = true
    const res = await $appwrite.databases.listDocuments(DB_ID, COLL_ID, [
      Query.equal('merchant_id', authStore.user.$id)
    ])
    products.value = res.documents
  } catch (error: any) {
    console.error('Failed to fetch merchant products:', error.message)
  } finally {
    isLoading.value = false
  }
}

const openModal = (p: any = null) => {
  if (p) {
    editingId.value = p.$id
    form.name = p.name
    form.price = p.price
    form.category = p.category
    form.description = p.description
    form.location = p.location
    form.image = p.image
    imagePreview.value = p.image
  } else {
    editingId.value = null
    form.name = ''
    form.price = 0
    form.category = 'Banten'
    form.description = ''
    form.location = authStore.user?.prefs?.address || ''
    form.image = ''
    imagePreview.value = ''
  }
  imageFile.value = null
  showModal.value = true
}

const saveProduct = async () => {
  try {
    isSaving.value = true
    
    let imageUrl = form.image
    
    // 1. Handle image upload if new file exists
    if (imageFile.value) {
      const upload = await $appwrite.storage.createFile(BUCKET_ID, ID.unique(), imageFile.value)
      // Get the preview/view URL
      imageUrl = `${useRuntimeConfig().public.appwriteEndpoint}/storage/buckets/${BUCKET_ID}/files/${upload.$id}/view?project=${useRuntimeConfig().public.appwriteProjectId}`
    }

    const payload = {
      name: form.name,
      price: Number(form.price),
      category: form.category,
      description: form.description,
      location: form.location,
      image: imageUrl,
      merchant_id: authStore.user.$id
    }

    if (editingId.value) {
      await $appwrite.databases.updateDocument(DB_ID, COLL_ID, editingId.value, payload)
    } else {
      await $appwrite.databases.createDocument(DB_ID, COLL_ID, ID.unique(), payload)
    }

    await fetchMyProducts()
    showModal.value = false
    alert(`Produk berhasil ${editingId.value ? 'diperbarui' : 'ditambahkan'}!`)
  } catch (error: any) {
    alert('Gagal menyimpan produk: ' + error.message)
  } finally {
    isSaving.value = false
  }
}

const deleteProduct = async (id: string) => {
  if (!confirm('Apakah Anda yakin ingin menghapus produk ini?')) return
  try {
    await $appwrite.databases.deleteDocument(DB_ID, COLL_ID, id)
    await fetchMyProducts()
  } catch (error: any) {
    alert('Gagal menghapus produk: ' + error.message)
  }
}

const formatRupiah = (num: number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0
  }).format(num)
}

onMounted(() => {
  fetchMyProducts()
})
</script>

<template>
  <div class="space-y-8">
    <div class="flex items-center justify-between">
      <div>
        <h2 class="text-2xl font-bold text-default font-serif">Produk Saya</h2>
        <p class="text-muted text-sm">Kelola katalog sarana upacara yang Anda jual.</p>
      </div>
      <button 
        @click="openModal()" 
        class="bg-brand text-white px-6 py-2.5 rounded-xl font-bold text-sm shadow-lg shadow-brand/20 active:scale-95 transition-all flex items-center gap-2"
      >
        <Icon name="lucide:plus" class="w-4 h-4" />
        Tambah Produk Baru
      </button>
    </div>

    <!-- Product Table -->
    <div class="bg-surface rounded-2xl border border-default overflow-hidden shadow-sm">
      <div v-if="isLoading" class="p-20 flex justify-center">
        <Icon name="lucide:loader-2" class="w-10 h-10 animate-spin text-brand" />
      </div>
      
      <div v-else-if="products.length === 0" class="p-20 text-center opacity-40">
           <Icon name="lucide:package-open" class="w-12 h-12 mx-auto mb-4" />
           <p class="text-sm font-medium">Belum ada produk yang ditambahkan.</p>
      </div>

      <table v-else class="w-full text-left">
        <thead>
          <tr class="bg-default/5 text-[10px] uppercase tracking-widest font-extrabold text-muted border-b border-default">
            <th class="px-6 py-4">Produk</th>
            <th class="px-6 py-4">Kategori</th>
            <th class="px-6 py-4">Harga</th>
            <th class="px-6 py-4 text-right">Aksi</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-default">
          <tr v-for="p in products" :key="p.$id" class="hover:bg-default/5 transition-colors group">
            <td class="px-6 py-4">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center overflow-hidden border border-default shrink-0">
                  <img v-if="p.image" :src="p.image" class="w-full h-full object-cover" />
                  <span v-else class="text-lg opacity-30">🛍️</span>
                </div>
                <div>
                    <p class="font-bold text-sm text-default leading-tight">{{ p.name }}</p>
                    <p class="text-[10px] text-muted">{{ p.location }}</p>
                </div>
              </div>
            </td>
            <td class="px-6 py-4">
               <span class="px-2.5 py-1 rounded-full text-[10px] font-bold bg-brand/10 text-brand">
                  {{ p.category }}
               </span>
            </td>
            <td class="px-6 py-4 font-bold text-sm">{{ formatRupiah(p.price) }}</td>
            <td class="px-6 py-4 text-right">
              <div class="flex items-center justify-end gap-2">
                <button @click="openModal(p)" class="p-2 bg-default/10 hover:bg-brand/10 hover:text-brand rounded-lg transition-colors text-muted" title="Edit">
                  <Icon name="lucide:pencil" class="w-4 h-4" />
                </button>
                <button @click="deleteProduct(p.$id)" class="p-2 bg-default/10 hover:bg-red-50 hover:text-red-500 rounded-lg transition-colors text-muted" title="Hapus">
                  <Icon name="lucide:trash-2" class="w-4 h-4" />
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Add/Edit Modal -->
    <UiModal :show="showModal" :title="editingId ? 'Edit Produk' : 'Tambah Produk Baru'" @close="showModal = false">
      <form @submit.prevent="saveProduct" class="space-y-5 py-2">
        <!-- Image Upload -->
        <div class="space-y-2">
          <label class="text-[10px] font-bold uppercase tracking-widest text-muted">Foto Produk</label>
          <div class="relative group aspect-video bg-default rounded-2xl overflow-hidden border-2 border-dashed border-default hover:border-brand/40 transition-colors flex flex-col items-center justify-center cursor-pointer">
             <img v-if="imagePreview" :src="imagePreview" class="absolute inset-0 w-full h-full object-cover" />
             <div v-else class="flex flex-col items-center gap-2 opacity-40">
                <Icon name="lucide:image-plus" class="w-10 h-10" />
                <span class="text-xs font-bold">Klik untuk unggah</span>
             </div>
             <input type="file" @change="onFileChange" accept="image/*" class="absolute inset-0 opacity-0 cursor-pointer" />
          </div>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
           <div class="space-y-1">
             <label class="text-[10px] font-bold uppercase tracking-widest text-muted">Nama Produk</label>
             <input v-model="form.name" type="text" class="input-field" placeholder="Contoh: Banten Pejati" required />
           </div>
           <div class="space-y-1">
             <label class="text-[10px] font-bold uppercase tracking-widest text-muted">Kategori</label>
             <select v-model="form.category" class="input-field" required>
                <option v-for="c in categories" :key="c" :value="c">{{ c }}</option>
             </select>
           </div>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
           <div class="space-y-1">
             <label class="text-[10px] font-bold uppercase tracking-widest text-muted">Harga (Rp)</label>
             <input v-model="form.price" type="number" class="input-field" placeholder="0" required />
           </div>
           <div class="space-y-1">
             <label class="text-[10px] font-bold uppercase tracking-widest text-muted">Lokasi Penjualan</label>
             <input v-model="form.location" type="text" class="input-field" placeholder="Contoh: Denpasar Timur" required />
           </div>
        </div>

        <div class="space-y-1">
           <label class="text-[10px] font-bold uppercase tracking-widest text-muted">Deskripsi</label>
           <textarea v-model="form.description" class="input-field min-h-[100px] py-3" placeholder="Jelaskan detail produk Anda..."></textarea>
        </div>

        <div class="flex gap-4 pt-4">
          <button type="button" @click="showModal = false" class="flex-1 py-3 border border-default rounded-xl font-bold text-muted hover:bg-default/5 transition-all">Batal</button>
          <button type="submit" :disabled="isSaving" class="flex-1 py-3 bg-brand text-white rounded-xl font-bold shadow-lg shadow-brand/20 active:scale-95 transition-all disabled:opacity-50">
             <Icon v-if="isSaving" name="lucide:loader-2" class="w-5 h-5 animate-spin mx-auto" />
             <span v-else>{{ editingId ? 'Simpan Perubahan' : 'Tambah Produk' }}</span>
          </button>
        </div>
      </form>
    </UiModal>
  </div>
</template>
