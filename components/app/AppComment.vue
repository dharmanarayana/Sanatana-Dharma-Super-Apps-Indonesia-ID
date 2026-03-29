<template>
  <div class="mt-12 space-y-8 animate-fade-in" id="comments-section">
    <div class="flex items-center gap-3">
      <div class="w-10 h-10 rounded-xl bg-brand/10 flex items-center justify-center text-brand">
        <Icon name="lucide:messages-square" size="22" />
      </div>
      <h2 class="text-2xl font-black italic tracking-tight uppercase">Komentar</h2>
      <div v-if="authStore.isLoggedIn" class="px-2 py-1 bg-brand/10 text-brand text-[10px] font-black rounded-md uppercase tracking-widest">
        Member
      </div>
    </div>

    <!-- Internal Commentary (Logged In) -->
    <div v-if="authStore.isLoggedIn" class="space-y-8">
      <!-- Comment Form -->
      <div class="card p-6 border-brand/20 bg-brand/[0.02]">
        <div class="flex gap-4">
          <div class="w-10 h-10 rounded-full bg-charcoal text-white flex items-center justify-center font-bold text-sm shrink-0">
            {{ authStore.user?.name?.charAt(0) || 'U' }}
          </div>
          <div class="flex-1 space-y-4">
            <textarea
              v-model="newComment"
              placeholder="Tulis pendapat atau pertanyaan Anda..."
              class="w-full bg-surface border border-default rounded-2xl p-4 text-sm focus:border-brand focus:ring-1 focus:ring-brand outline-none transition-all min-h-[100px] resize-none"
              :disabled="submitting"
            ></textarea>
            <div class="flex justify-end">
              <button
                @click="handleSubmit"
                class="btn-primary py-2 px-6 text-sm flex items-center gap-2"
                :disabled="!newComment.trim() || submitting"
              >
                <Icon v-if="submitting" name="lucide:loader-2" class="animate-spin" />
                <span>{{ submitting ? 'Mengirim...' : 'Kirim Komentar' }}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Comments List -->
      <div v-if="loading" class="flex flex-col items-center py-12 gap-4">
        <div class="loading loading-spinner text-brand loading-md"></div>
        <p class="text-xs text-muted italic">Memuat komentar...</p>
      </div>

      <div v-else-if="comments.length > 0" class="space-y-6">
        <div v-for="comment in comments" :key="comment.$id" class="flex gap-4 group">
          <div class="w-10 h-10 rounded-full bg-brand/10 text-brand flex items-center justify-center font-bold text-sm shrink-0 uppercase">
            {{ comment.userName?.charAt(0) || '?' }}
          </div>
          <div class="flex-1 space-y-1">
            <div class="flex items-center gap-2">
              <span class="font-bold text-sm text-default">{{ comment.userName }}</span>
              <span v-if="comment.userRole === 'admin'" class="px-1.5 py-0.5 bg-red-500/10 text-red-500 text-[8px] font-black rounded uppercase tracking-widest">Admin</span>
              <span class="text-[10px] text-muted">{{ timeAgo(comment.$createdAt) }}</span>
            </div>
            <p class="text-sm text-muted leading-relaxed">{{ comment.content }}</p>
          </div>
        </div>
      </div>

      <div v-else class="text-center py-12 card border-dashed border-2">
        <Icon name="lucide:message-circle-off" size="32" class="text-muted mx-auto mb-3 opacity-20" />
        <p class="text-sm text-muted italic">Belum ada komentar. Jadilah yang pertama!</p>
      </div>
    </div>

    <!-- Facebook Commentary (Guests) -->
    <div v-else class="space-y-8">
      <div class="p-6 rounded-2xl bg-charcoal text-white flex flex-col md:flex-row items-center gap-6">
        <div class="flex-1 text-center md:text-left">
          <p class="text-lg font-bold mb-1">Berikan Komentar Anda</p>
          <p class="text-xs text-white/60">Masuk dengan akun Sanatana Dharma untuk berkomentar langsung, atau gunakan akun Facebook Anda di bawah.</p>
        </div>
        <NuxtLink to="/login" class="btn-primary bg-white text-charcoal hover:bg-brand hover:text-white px-6 py-2.5 text-sm shrink-0">
          Masuk Sekarang
        </NuxtLink>
      </div>

      <div class="bg-surface rounded-2xl p-4 border border-default min-h-[200px] flex items-center justify-center">
        <!-- FB SDK will inject comments here -->
        <div 
          class="fb-comments" 
          :data-href="currentPageUrl" 
          data-width="100%" 
          data-numposts="5"
          data-colorscheme="light"
        ></div>
        <div v-if="!fbLoaded" class="flex flex-col items-center gap-3">
          <div class="loading loading-spinner text-brand opacity-20"></div>
          <p class="text-[10px] text-muted italic">Menyiapkan Facebook Comments...</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  itemId: string
  itemType: 'pura' | 'video'
}>()

const authStore = useAuthStore()
const { comments, loading, fetchComments, addComment, subscribeToComments } = useComments()
const newComment = ref('')
const submitting = ref(false)
const fbLoaded = ref(false)
const route = useRoute()

// Computed current URL for Facebook
const currentPageUrl = computed(() => {
  if (import.meta.client) {
    return window.location.href.split('#')[0]
  }
  return ''
})

let unsubscribe: (() => void) | null = null

onMounted(async () => {
  if (authStore.isLoggedIn) {
    // Internal Setup
    await fetchComments(props.itemId, props.itemType)
    unsubscribe = subscribeToComments(props.itemId, props.itemType)
  } else {
    // Facebook Setup
    initFacebookSDK()
  }
})

onUnmounted(() => {
  if (unsubscribe) unsubscribe()
})

const handleSubmit = async () => {
  if (!newComment.value.trim() || submitting.value) return
  submitting.value = true
  try {
    await addComment(props.itemId, props.itemType, newComment.value)
    newComment.value = ''
  } catch (e: any) {
    alert('Gagal mengirim komentar: ' + e.message)
  } finally {
    submitting.value = false
  }
}

const initFacebookSDK = () => {
  if (import.meta.client) {
    // Check if already loaded
    if ((window as any).FB) {
      fbLoaded.value = true
      // Re-parse the DOM for FB widgets
      setTimeout(() => (window as any).FB.XFBML.parse(), 100)
      return
    }

    // Load SDK
    const id = 'facebook-jssdk'
    if (document.getElementById(id)) return

    const fjs = document.getElementsByTagName('script')[0]
    const js = document.createElement('script')
    js.id = id
    js.src = "https://connect.facebook.net/id_ID/sdk.js#xfbml=1&version=v18.0"
    js.async = true
    js.defer = true
    js.crossOrigin = "anonymous"
    
    js.onload = () => {
      fbLoaded.value = true
    }

    fjs?.parentNode?.insertBefore(js, fjs)
  }
}

const timeAgo = (date: string) => {
  if (!date) return ''
  const now = new Date()
  const then = new Date(date)
  const diff = Math.floor((now.getTime() - then.getTime()) / 1000)

  if (diff < 60) return 'Baru saja'
  if (diff < 3600) return `${Math.floor(diff / 60)} menit lalu`
  if (diff < 86400) return `${Math.floor(diff / 3600)} jam lalu`
  return formatDate(date)
}

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  })
}
</script>

<style scoped>
.btn-primary {
  background-color: var(--brand-primary);
  color: var(--text-inverse);
  font-weight: 800;
  border-radius: var(--radius-xl);
  transition: all 0.2s;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}
.btn-primary:not(:disabled):hover {
  transform: translateY(-2px);
  filter: brightness(1.1);
  box-shadow: 0 10px 20px -10px var(--brand-primary);
}
.btn-primary:active {
  transform: scale(0.95);
}
.btn-primary:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.fb-comments {
  width: 100% !important;
}

/* Force FB comments to be responsive */
:deep(.fb-comments iframe) {
  width: 100% !important;
}
</style>
