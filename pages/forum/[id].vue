<script setup lang="ts">
const route = useRoute()
const forum = useForum()
const authStore = useAuthStore()

const postId = route.params.id as string
const post = ref<any>(null)
const comments = ref<any[]>([])
const isLoading = ref(true)
const newComment = ref('')
const isPosting = ref(false)

const loadData = async () => {
  isLoading.value = true
  try {
    const [p, c] = await Promise.all([
      forum.fetchPost(postId),
      forum.fetchComments(postId)
    ])
    post.value = p
    comments.value = c
  } finally {
    isLoading.value = false
  }
}

const handleAddComment = async () => {
  if (!newComment.value || isPosting.value) return
  isPosting.value = true
  try {
    await forum.addComment(postId, newComment.value)
    newComment.value = ''
    // Realtime will handle the update in a real environment, 
    // but for demo we manually push to mock state
    // if realtime is not yet set up on the server
    const fakeComment = {
       $id: Date.now().toString(),
       post_id: postId,
       content: newComment.value,
       author: authStore.user.name,
       author_id: authStore.user.$id,
       isSulinggih: authStore.user?.prefs?.role === 'sulinggih',
       $createdAt: new Date().toISOString()
    }
    // comments.value = [...comments.value, fakeComment]
  } finally {
    isPosting.value = false
  }
}

const formatTime = (dateStr: string) => {
  if (!dateStr) return '-'
  return new Date(dateStr).toLocaleDateString('id-ID', {
    day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit'
  })
}

onMounted(() => {
  loadData()
  const unsubscribe = forum.subscribeToComments(postId, (res: any) => {
    const event = res.events[0]
    if (event.includes('.create')) {
      comments.value = [...comments.value, res.payload]
    }
  })

  onUnmounted(() => {
    unsubscribe()
  })
})
</script>

<template>
  <div class="min-h-screen pb-24 bg-base">
    <!-- Sticky Header -->
    <div class="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-default h-16 flex items-center px-4">
       <button @click="$router.back()" class="w-10 h-10 rounded-full hover:bg-default flex items-center justify-center transition-colors text-default">
          <Icon name="lucide:chevron-left" class="w-6 h-6" />
       </button>
       <h1 class="ml-2 font-black italic text-brand text-lg">Detail Diskusi</h1>
    </div>

    <div v-if="isLoading" class="flex flex-col items-center justify-center py-20 gap-4">
       <Icon name="lucide:loader-2" class="w-10 h-10 animate-spin text-brand" />
       <p class="text-sm font-medium text-muted">Sedang mengambil thread...</p>
    </div>

    <div v-else-if="post" class="max-w-4xl mx-auto mt-6 px-4 md:px-0 space-y-8">
      <!-- Original Thread Post -->
      <section class="card p-8 border-l-8 border-l-brand relative overflow-hidden shadow-2xl">
         <div class="flex items-center gap-4 mb-6">
            <div class="w-14 h-14 rounded-full bg-brand/10 border-2 border-brand/20 flex items-center justify-center text-2xl shadow-inner">
               {{ post.author?.charAt(0) || '👤' }}
            </div>
            <div>
               <div class="flex items-center gap-2">
                  <h2 class="text-xl font-black italic text-default leading-none">{{ post.author }}</h2>
                  <Icon v-if="post.isAuthorAdmin" name="lucide:verified" class="w-5 h-5 text-brand" />
               </div>
               <p class="text-[10px] font-black text-muted uppercase tracking-widest mt-1">
                  {{ post.category }} • {{ formatTime(post.$createdAt) }}
               </p>
            </div>
         </div>
         <p class="text-lg leading-relaxed text-secondary mb-8 font-serif">
            {{ post.content }}
         </p>
         <div class="flex items-center gap-6 pt-6 border-t border-default/50">
            <div class="flex items-center gap-2 text-xs font-black text-muted uppercase tracking-tighter">
               <Icon name="lucide:thumbs-up" class="w-5 h-5 text-brand" />
               <span>{{ post.likes }} Orang Suka</span>
            </div>
            <div class="flex items-center gap-2 text-xs font-black text-muted uppercase tracking-tighter">
               <Icon name="lucide:message-circle" class="w-5 h-5 text-brand" />
               <span>{{ comments.length }} Jawaban</span>
            </div>
         </div>
      </section>

      <!-- Comments List -->
      <section class="space-y-6">
         <div class="flex items-center gap-3 mb-8">
            <div class="w-1.5 h-6 bg-brand rounded-full"></div>
            <h3 class="text-xl font-black italic tracking-tight text-default">Semua Jawaban & Diskusi</h3>
         </div>

         <div v-if="comments.length === 0" class="flex flex-col items-center justify-center py-16 opacity-30 text-center">
            <Icon name="lucide:message-square-dashed" class="w-16 h-16 mb-4" />
            <p class="font-bold">Belum ada jawaban.<br>Jadilah yang pertama untuk berbagi kearifan.</p>
         </div>

         <div v-else class="space-y-6">
            <div v-for="c in comments" :key="c.$id" 
                 class="card p-6 border border-default/50 hover:border-brand/30 transition-all relative"
                 :class="c.isSulinggih ? 'bg-brand/5 border-l-4 border-l-brand' : ''">
               
               <!-- Verified Sulinggih Badge -->
               <div v-if="c.isSulinggih" class="absolute top-2 right-4 flex items-center gap-1.5 bg-brand text-white text-[8px] font-black italic uppercase px-3 py-1 rounded-full shadow-lg shadow-brand/20 tracking-widest">
                  <Icon name="lucide:award" class="w-3 h-3" />
                  Sulinggih Verified
               </div>

               <div class="flex items-center gap-3 mb-4">
                   <div class="w-10 h-10 rounded-full bg-default flex items-center justify-center text-sm font-bold border border-default">
                      {{ c.author?.charAt(0) }}
                   </div>
                   <div>
                      <h4 class="font-bold text-sm text-default">{{ c.author }}</h4>
                      <p class="text-[9px] text-muted font-bold">{{ formatTime(c.$createdAt) }}</p>
                   </div>
               </div>
               <p class="text-sm leading-relaxed text-secondary pl-1">
                  {{ c.content }}
               </p>
            </div>
         </div>
      </section>

      <!-- Reply Form (Persistent) -->
      <div v-if="authStore.isLoggedIn" 
           class="fixed bottom-0 left-0 right-0 p-4 bg-white/80 backdrop-blur-md border-t border-default z-30">
         <div class="max-w-4xl mx-auto flex items-end gap-3 bg-surface p-2 rounded-[2rem] border-2 border-brand/20 shadow-xl">
            <textarea v-model="newComment"
                      rows="1"
                      placeholder="Bagikan pandangan Anda..."
                      class="flex-1 bg-transparent px-6 py-3 text-sm focus:outline-none resize-none font-medium h-12"
                      @keyup.enter.ctrl="handleAddComment"></textarea>
            <button @click="handleAddComment"
                    :disabled="!newComment || isPosting"
                    class="w-12 h-12 rounded-full bg-brand text-white flex items-center justify-center shadow-lg shadow-brand/20 disabled:opacity-50 active:scale-95 transition-all shrink-0">
               <Icon v-if="isPosting" name="lucide:loader-2" class="w-6 h-6 animate-spin" />
               <Icon v-else name="lucide:send" class="w-6 h-6" />
            </button>
         </div>
         <p class="text-center text-[8px] font-bold text-muted uppercase mt-2 tracking-widest opacity-50">
            Tekan Ctrl + Enter untuk mengirim dengan cepat
         </p>
      </div>

      <div v-else class="text-center py-10 bg-default/5 rounded-[2rem] border border-default border-dashed">
         <p class="text-sm text-muted font-bold mb-4">Ingin ikut berdiskusi?</p>
         <button @click="navigateTo('/login')" class="btn-primary px-10 py-3 rounded-full text-xs italic tracking-widest uppercase">
            Masuk Sekarang 🔑
         </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
