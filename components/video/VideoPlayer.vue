<template>
  <div class="video-player-root group overflow-hidden rounded-2xl shadow-2xl bg-charcoal border border-brand/10 transition-shadow hover:shadow-brand/5 relative">
    <!-- Skeleton Loading -->
    <div v-if="loading" class="absolute inset-0 skeleton z-10"></div>

    <!-- Offline Overlay -->
    <Transition name="fade">
      <div v-if="!isOnline" 
           class="absolute inset-0 z-30 flex flex-col items-center justify-center bg-charcoal/90 backdrop-blur-xl p-6 text-center">
        <div class="w-20 h-20 bg-brand/10 rounded-full flex items-center justify-center mb-6 animate-pulse border-2 border-brand/30">
          <Icon name="tabler:wifi-off" class="w-10 h-10 text-brand" />
        </div>
        <h3 class="text-xl font-black text-white mb-2 uppercase tracking-widest font-serif">Koneksi Terputus</h3>
        <p class="text-white/60 text-sm max-w-xs leading-relaxed">
          Pemutaran video terhenti. Silakan periksa koneksi internet Anda untuk melanjutkan pencerahan ini.
        </p>
        <button @click="refreshPage" class="mt-8 px-8 py-3 bg-brand text-white text-xs font-black uppercase tracking-[0.2em] rounded-2xl hover:bg-brand-secondary transition-all active:scale-95 shadow-lg shadow-brand/20">
          Hubungkan Kembali
        </button>
      </div>
    </Transition>

    <!-- Resume Prompt Overlay -->
    <Transition name="fade">
      <div v-if="showResumePrompt && isOnline" 
           class="absolute bottom-16 left-4 right-4 z-20 flex items-center justify-between p-3 bg-charcoal/90 backdrop-blur-md rounded-xl border border-brand/20 shadow-lg pointer-events-auto">
        <div class="flex items-center gap-3">
          <div class="w-8 h-8 rounded-full bg-brand/20 flex items-center justify-center">
            <Icon name="lucide:history" class="w-4 h-4 text-brand" />
          </div>
          <p class="text-sm font-medium text-white">Lanjutkan menonton? ({{ formatTime(savedTime) }})</p>
        </div>
        <div class="flex items-center gap-2">
          <button @click="dismissResume" class="p-2 text-muted hover:text-white transition-colors">
            <Icon name="lucide:x" class="w-4 h-4" />
          </button>
          <button @click="resumePlayback" class="px-3 py-1.5 bg-brand text-white text-xs font-bold rounded-lg hover:bg-brand-dark transition-all active:scale-95">
            Lanjutkan
          </button>
        </div>
      </div>
    </Transition>

    <!-- Embed for YouTube/Vimeo -->
    <div v-if="provider !== 'html5'" 
         ref="playerElement" 
         :data-plyr-provider="provider" 
         :data-plyr-embed-id="src"
         class="plyr__video-embed">
    </div>
    
    <!-- HTML5 Video -->
    <video v-else
           ref="playerElement"
           playsinline
           controls
           :data-poster="poster"
           class="w-full h-full">
      <source :src="src" type="video/mp4" />
    </video>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount, watch } from 'vue'

const { isOnline, refreshPage } = useNetworkStatus()

interface Props {
  src: string
  provider?: 'html5' | 'youtube' | 'vimeo'
  poster?: string
  options?: any // Plyr.Options
}

const props = withDefaults(defineProps<Props>(), {
  provider: 'html5',
})

const playerElement = ref<HTMLElement | null>(null)
const player = ref<any>(null)
const loading = ref(true)
const showResumePrompt = ref(false)
const savedTime = ref(0)
const storageKey = computed(() => `video-progress-${props.src}`)

const initPlayer = async () => {
  if (process.server) return

  // Dynamic import for SSR safety
  const { default: Plyr } = await import('plyr')

  if (player.value) {
    player.value.destroy()
  }

  if (playerElement.value) {
    player.value = new Plyr(playerElement.value, {
      ...props.options,
      tooltips: { controls: true, seek: true },
      keyboard: { focused: true, global: true },
      captions: { active: true, update: true, language: 'id' },
      hideControls: true,
      resetOnEnd: true,
      settings: ['quality', 'speed', 'loop', 'captions'],
      controls: [
        'play-large', 'play', 'progress', 'current-time', 'mute', 'volume', 
        'captions', 'settings', 'pip', 'airplay', 'fullscreen'
      ],
      storage: { enabled: true, key: 'plyr' }
    })

    // Remove loading state when ready
    player.value.on('ready', () => {
      loading.value = false
      checkProgress()
    })

    // Track progress
    player.value.on('timeupdate', () => {
      saveProgress()
    })

    // Clear progress when finished
    player.value.on('ended', () => {
      localStorage.removeItem(storageKey.value)
    })
    
    // Fallback for loading state
    setTimeout(() => { loading.value = false }, 2000)
  }
}

// Logic for Resume Watching
const checkProgress = () => {
  const saved = localStorage.getItem(storageKey.value)
  if (saved) {
    const time = parseFloat(saved)
    // Only show if more than 10s and not near the end (98%)
    if (time > 10 && player.value.duration > 0 && time < player.value.duration * 0.98) {
      savedTime.value = time
      showResumePrompt.value = true
      
      // Auto-hide after 8 seconds if not interacted with
      setTimeout(() => {
        showResumePrompt.value = false
      }, 8000)
    }
  }
}

const saveProgress = () => {
  if (player.value && player.value.currentTime > 5) {
    localStorage.setItem(storageKey.value, player.value.currentTime.toString())
  }
}

const resumePlayback = () => {
  if (player.value && savedTime.value > 0) {
    player.value.currentTime = savedTime.value
    player.value.play()
    showResumePrompt.value = false
  }
}

const dismissResume = () => {
  showResumePrompt.value = false
}

const formatTime = (seconds: number) => {
  const min = Math.floor(seconds / 60)
  const sec = Math.floor(seconds % 60)
  return `${min}:${sec.toString().padStart(2, '0')}`
}

onMounted(() => {
  initPlayer()
})

onBeforeUnmount(() => {
  if (player.value) {
    player.value.destroy()
  }
})

watch(() => props.src, () => {
  if (player.value) {
    player.value.source = {
      type: 'video',
      sources: [
        {
          src: props.src,
          provider: props.provider as any,
        },
      ],
      poster: props.poster,
    };
  }
})

defineExpose({
  player
})
</script>

<style>
/* 
  Custom styling for the root container 
  Using aspect-ratio for modern, responsive behavior
*/
.video-player-root {
  position: relative;
  width: 100%;
  aspect-ratio: 16 / 9;
  background-color: #000;
}

/* Ensure the Plyr instance occupies the full container */
.plyr {
  height: 100%;
  width: 100%;
  --plyr-color-main: var(--brand-primary);
}

.plyr--full-ui.plyr--video .plyr__control--overlaid {
  background: var(--brand-primary);
  border-radius: 50%;
  padding: 1.25rem;
}

/* Subtitles / Captions adjustment */
.plyr__captions {
  font-family: var(--font-sans);
  font-size: 1.1rem;
  font-weight: 500;
}

/* Fade Transition */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(10px);
}
</style>
