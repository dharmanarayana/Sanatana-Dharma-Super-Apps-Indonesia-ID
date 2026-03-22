<template>
  <Transition name="fade-up">
    <div v-if="visible" class="fixed bottom-24 left-4 right-4 z-50 lg:left-auto lg:right-6 lg:bottom-6 lg:w-[350px]">
      <div class="relative overflow-hidden bg-surface/80 backdrop-blur-xl border border-brand/20 rounded-3xl p-5 shadow-2xl shadow-brand/10 group">
        <!-- Close Button -->
        <button @click="close" class="absolute top-3 right-3 p-1.5 rounded-full hover:bg-black/5 transition-all active:scale-95">
          <Icon name="lucide:x" size="16" class="text-muted" />
        </button>

        <div class="flex items-start gap-4">
          <div class="flex-shrink-0 w-12 h-12 rounded-2xl bg-gradient-to-br from-brand to-gold flex items-center justify-center shadow-lg shadow-brand/20">
            <Icon :name="platformIcon" size="24" class="text-white" />
          </div>
          
          <div class="flex-1 pr-6">
            <h4 class="font-serif font-bold text-default text-sm">Follow Sanatana Dharma! 🙏</h4>
            <p class="text-muted text-[11px] leading-snug mt-1">
              Dukung kami dengan mengikuti media sosial resmi {{ platformName }} kami untuk update harian.
            </p>
          </div>
        </div>

        <div class="grid grid-cols-3 gap-2 mt-4">
          <a v-for="social in socialLinks" :key="social.name"
             :href="social.url" target="_blank"
             @click="close"
             class="flex flex-col items-center gap-1.5 p-2 rounded-xl bg-surface border border-default hover:border-brand/30 hover:bg-brand/5 transition-all group/btn">
            <Icon :name="social.icon" size="18" :class="social.color" class="group-hover/btn:scale-110 transition-transform" />
            <span class="text-[9px] font-bold text-default uppercase tracking-tighter">{{ social.name }}</span>
          </a>
        </div>

        <div class="absolute bottom-0 left-0 h-1 bg-brand w-full origin-left animate-progress"></div>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { useSocialDetection } from '~/composables/useSocialDetection'

const { platform, isSocialReferrer } = useSocialDetection()
const visible = ref(false)

const platformName = computed(() => {
  if (platform.value === 'facebook') return 'Facebook'
  if (platform.value === 'instagram') return 'Instagram'
  if (platform.value === 'tiktok') return 'TikTok'
  return 'Media Sosial'
})

const platformIcon = computed(() => {
  if (platform.value === 'facebook') return 'lucide:facebook'
  if (platform.value === 'instagram') return 'lucide:instagram'
  if (platform.value === 'tiktok') return 'lucide:music-2'
  return 'lucide:share-2'
})

const socialLinks = [
  { name: 'Facebook',  icon: 'lucide:facebook',  color: 'text-blue-600',   url: 'https://facebook.com/sanatanadharma1901' },
  { name: 'Instagram', icon: 'lucide:instagram', color: 'text-pink-600',   url: 'https://instagram.com/sanatanadharma1901' },
  { name: 'TikTok',    icon: 'lucide:music-2',   color: 'text-teal-600',   url: 'https://tiktok.com/@sanatanadharma1901' }
]

const close = () => {
  visible.value = false
  localStorage.setItem('sdd_social_popup_closed', 'true')
}

onMounted(() => {
  if (!isSocialReferrer.value) return
  const isClosed = localStorage.getItem('sdd_social_popup_closed')
  if (isClosed) return

  // Show after 5 seconds
  setTimeout(() => {
    visible.value = true
    
    // Auto close after another 10 seconds
    setTimeout(() => {
      if (visible.value) close()
    }, 10000)
  }, 5000)
})
</script>

<style scoped>
.fade-up-enter-active, .fade-up-leave-active {
  transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
}
.fade-up-enter-from {
  opacity: 0;
  transform: translateY(20px) scale(0.95);
}
.fade-up-leave-to {
  opacity: 0;
  transform: translateY(10px) scale(0.98);
}

@keyframes progress {
  from { transform: scaleX(1); }
  to { transform: scaleX(0); }
}
.animate-progress {
  animation: progress 10s linear forwards;
}
</style>
