<template>
  <div>
    <UiPageHeader icon="💬" title="Forum Diskusi"
                  subtitle="Berbagi kearifan dengan sesama umat"
                  back-path="/" />
    <div class="px-4 lg:px-0 py-4 grid lg:grid-cols-[1fr_300px] gap-8">
      <div class="space-y-4">
        <button v-if="authStore.isLoggedIn" @click="showModal = true" class="btn-primary w-full py-4 justify-center gap-2 mb-4 shadow-md hover:shadow-lg active:scale-[0.98] transition-all">
          Buat Postingan Baru ✍️
        </button>
        <div class="space-y-4">
          <div class="flex items-center gap-4 border-b border-default pb-2">
            <button v-for="t in ['Terbaru', 'Populer', 'Tanya Jawab']" :key="t"
                    class="text-[10px] font-bold uppercase tracking-wider px-2 py-1"
                    :class="t === 'Terbaru' ? 'text-brand border-b-2 border-brand' : 'text-muted'">
              {{ t }}
            </button>
          </div>
          
          <div v-if="loading" class="space-y-4 animate-pulse">
            <div v-for="i in 3" :key="i" class="card h-32 bg-muted/20"></div>
          </div>
          <template v-else>
            <ForumPostCard v-for="post in posts" :key="post.$id" :post="post" />
          </template>
        </div>
      </div>
      <aside class="hidden lg:block space-y-6">
        <div class="card p-4">
          <h4 class="card-label mb-4 text-muted text-[10px]">DISKUSI HANGAT</h4>
          <div class="space-y-3">
            <div v-for="c in categories" :key="c.name"
                 class="flex justify-between items-center text-xs p-2 hover:bg-brand/5 rounded-xl transition-colors cursor-pointer group">
              <span class="font-medium group-hover:text-brand">{{ c.name }}</span>
              <span class="text-[10px] font-bold text-muted bg-elevated px-2 py-0.5 rounded-full">{{ c.count }}</span>
            </div>
          </div>
        </div>
      </aside>
    </div>

    <!-- Create Post Modal -->
    <UiModal v-model="showModal" title="Buat Postingan Baru">
      <div class="space-y-5">
        <div>
          <label class="text-[10px] font-bold text-muted uppercase tracking-widest block mb-2">Kategori</label>
          <select v-model="selectedCategory" class="input-field h-12 text-sm font-medium">
            <option v-for="c in categories" :key="c.name" :value="c.name">{{ c.name }}</option>
          </select>
        </div>
        <div>
          <label class="text-[10px] font-bold text-muted uppercase tracking-widest block mb-2">Isi Postingan</label>
          <textarea v-model="newPostContent" rows="4" placeholder="Apa yang ingin Anda bagikan?" class="input-field p-4 text-sm resize-none"></textarea>
        </div>
        <button @click="handleSendPost" :disabled="!newPostContent" class="btn-primary w-full py-4 justify-center font-black italic disabled:opacity-50">
          KIRIM POSTINGAN 🚀
        </button>
      </div>
    </UiModal>
  </div>
</template>

<script setup>
const authStore = useAuthStore()
const { posts, loading, fetchPosts, subscribeToPosts, createPost } = useForum()

const showModal = ref(false)
const newPostContent = ref('')
const selectedCategory = ref('Umum')

onMounted(async () => {
  await fetchPosts()
  const unsubscribe = subscribeToPosts()
  
  onUnmounted(() => {
    unsubscribe()
  })
})

const handleSendPost = async () => {
  if (!newPostContent.value) return
  await createPost(newPostContent.value, selectedCategory.value)
  newPostContent.value = ''
  showModal.value = false
}

const categories = [
  { name: 'Upacara', count: 124 },
  { name: 'Filsafat', count: 56 },
  { name: 'Sejarah', count: 32 },
  { name: 'Tanya Jawab', count: 89 },
  { name: 'Umum', count: 210 }
]
</script>
