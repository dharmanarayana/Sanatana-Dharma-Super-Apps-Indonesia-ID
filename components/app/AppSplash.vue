<template>
  <Transition name="fade">
    <div v-if="visible" class="fixed inset-0 z-[100] bg-gradient-to-br from-brand-maroon via-brand to-brand-light flex flex-col items-center justify-center">
      <div class="relative flex items-center justify-center">
        <!-- Rotating Glow -->
        <div class="absolute w-40 h-40 bg-brand/30 blur-3xl animate-pulse-soft rounded-full"></div>
        
        <!-- Rotating Om Symbol -->
        <div class="text-8xl text-white drop-shadow-2xl animate-spin-slow">
          🕉️
        </div>
      </div>
      
      <div class="mt-8 text-center animate-fade-up">
        <h1 class="font-serif text-3xl font-bold text-white tracking-wide">
          Sanatana Dharma
        </h1>
        <p class="text-white/80 font-sans tracking-[0.2em] uppercase text-xs mt-2">
          Digital PWA
        </p>
      </div>
      
      <!-- Progress Bar -->
      <div class="absolute bottom-12 w-48 h-1 bg-white/20 rounded-full overflow-hidden">
        <div class="h-full bg-white shadow-[0_0_10px_rgba(255,255,255,0.5)] transition-all duration-[2500ms] ease-out" :style="{ width: progress + '%' }"></div>
      </div>
    </div>
  </Transition>
</template>

<script setup>
const emit = defineEmits(['finish'])
const visible = ref(true)
const progress = ref(0)

onMounted(() => {
  setTimeout(() => progress.value = 100, 100)
  
  setTimeout(() => {
    visible.value = false
    setTimeout(() => emit('finish'), 500)
  }, 3000)
})
</script>

<style scoped>
.fade-leave-active {
  transition: opacity 0.5s ease;
}
.fade-leave-to {
  opacity: 0;
}
</style>
