<template>
  <div class="card p-4 space-y-4">
    <div class="flex items-center gap-3">
      <div class="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-lg">👤</div>
      <div class="flex-1">
        <div class="flex items-center gap-1.5">
          <h4 class="font-black italic text-xs text-default">{{ post.author || 'Anonim' }}</h4>
          <span v-if="post.isAuthorAdmin" class="text-blue-500 text-[10px]" title="Verified Admin">✓</span>
        </div>
        <p class="text-[9px] font-bold text-muted uppercase tracking-tight">Baru saja • {{ post.category }}</p>
      </div>
    </div>
    <p class="body-text text-xs leading-relaxed text-charcoal/80">{{ post.content }}</p>
    <div class="flex gap-4 border-t border-default pt-3">
      <button @click="handleInteraction('like')" class="text-[10px] font-bold text-muted uppercase hover:text-brand transition-colors flex items-center gap-1">
        <span>👍</span> {{ post.likes ?? 0 }} Suka
      </button>
      <button @click="handleInteraction('comment')" class="text-[10px] font-bold text-muted uppercase hover:text-brand transition-colors flex items-center gap-1">
        <span>💬</span> {{ post.comments ?? 0 }} Komentar
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  post: any
}>()

const authStore = useAuthStore()
const { addPoints } = useAuth()

const handleInteraction = async (type: 'like' | 'comment') => {
  if (!authStore.isLoggedIn) {
    if (confirm(`Anda harus login terlebih dahulu untuk berinteraksi. Login sekarang?`)) {
      navigateTo('/login')
    }
    return
  }
  
  if (type === 'like') {
    await addPoints(2)
    alert('Bagus! Anda mendapatkan +2 Poin Dharma 🙏')
  } else {
    alert('Fitur komentar akan segera hadir!')
  }
}
</script>
