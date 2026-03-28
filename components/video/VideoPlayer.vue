<template>
  <div class="video-player-root overflow-hidden rounded-2xl shadow-2xl bg-charcoal border border-brand/10 transition-shadow hover:shadow-brand/5">
    <!-- Skeleton Loading -->
    <div v-if="loading" class="absolute inset-0 skeleton z-10"></div>

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
import { ref, onMounted, onBeforeUnmount, watch } from 'vue'

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
    })

    // Remove loading state when ready
    player.value.on('ready', () => {
      loading.value = false
    })
    
    // Fallback for loading state
    setTimeout(() => { loading.value = false }, 2000)
  }
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
</style>
