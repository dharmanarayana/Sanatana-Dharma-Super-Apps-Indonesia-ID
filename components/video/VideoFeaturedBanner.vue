<template>
  <div v-if="videos.length > 0" class="relative group h-48 md:h-64 rounded-2xl overflow-hidden shadow-xl border border-white/10">
    <Transition name="fade" mode="out-in">
      <NuxtLink :key="currentVideo?.slug" :to="`/video/${currentVideo?.slug}`" class="absolute inset-0 block">
        <img :src="currentVideo?.thumbnail" class="w-full h-full object-cover brightness-75 group-hover:scale-105 transition-transform duration-700" />
        <div class="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent"></div>
        <div class="absolute bottom-0 left-0 p-6 w-full">
          <div class="flex items-center gap-2 mb-2">
            <span class="px-2 py-0.5 bg-brand text-white text-[10px] font-bold rounded uppercase tracking-wider">Featured</span>
            <span class="px-2 py-0.5 bg-white/20 text-white text-[10px] font-bold rounded uppercase tracking-wider backdrop-blur-sm">
              {{ currentVideo?.category }}
            </span>
          </div>
          <h3 class="text-white font-bold text-xl md:text-2xl leading-tight line-clamp-2">{{ currentVideo?.title }}</h3>
        </div>
      </NuxtLink>
    </Transition>

    <!-- Dots -->
    <div class="absolute bottom-4 right-6 flex gap-1.5 z-20">
      <button v-for="(_, i) in videos" :key="i" 
              @click="currentIndex = i"
              :class="['w-2 h-2 rounded-full transition-all', currentIndex === i ? 'bg-brand w-6' : 'bg-white/40']"></button>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  videos: any[]
}>()

const currentIndex = ref(0)
const currentVideo = computed(() => props.videos[currentIndex.value])
let interval: any = null

onMounted(() => {
  interval = setInterval(() => {
    if (props.videos.length > 0) {
      currentIndex.value = (currentIndex.value + 1) % props.videos.length
    }
  }, 5000)
})

onUnmounted(() => {
  if (interval) clearInterval(interval)
})
</script>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 0.5s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
