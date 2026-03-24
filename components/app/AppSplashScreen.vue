<template>
  <Transition name="fade-overlay">
    <div v-if="show" class="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#FFF8F0] dark:bg-charcoal overflow-hidden">
      <!-- Background Glow -->
      <div class="absolute inset-0 overflow-hidden pointer-events-none">
        <div class="absolute -top-[20%] -left-[10%] w-[60%] h-[60%] bg-brand/10 blur-[120px] rounded-full animate-pulse"></div>
        <div class="absolute -bottom-[20%] -right-[10%] w-[60%] h-[60%] bg-gold/10 blur-[120px] rounded-full animate-pulse" style="animation-delay: 1s"></div>
      </div>

      <!-- Center Logo & Text -->
      <div class="relative flex flex-col items-center gap-6 animate-in fade-in zoom-in duration-700">
        <!-- Animated Logo Container -->
        <div class="relative w-24 h-24 sm:w-32 sm:h-32 rounded-3xl bg-gradient-to-br from-brand to-gold shadow-2xl shadow-brand/20 flex items-center justify-center transform hover:scale-105 transition-transform">
          <Icon name="fa6-solid:om" class="w-14 h-14 sm:w-20 sm:h-20 text-white animate-pulse" />
          <!-- Spinner Ring -->
          <div class="absolute inset-0 rounded-3xl border-2 border-white/20 border-t-white animate-spin duration-[2s]"></div>
        </div>

        <div class="text-center">
          <h1 class="font-serif font-bold text-2xl sm:text-3xl text-brand leading-tight">
            Sanatana Dharma
          </h1>
          <p class="text-muted text-xs sm:text-sm uppercase tracking-[0.3em] font-bold mt-1 opacity-80">
            Digital
          </p>
        </div>
      </div>

      <!-- Bottom Progress/Status -->
      <div class="absolute bottom-12 w-48 h-1 bg-brand/10 rounded-full overflow-hidden">
        <div class="h-full bg-brand animate-progress-bar"></div>
      </div>
    </div>
  </Transition>
</template>

<script setup>
const props = defineProps({
  show: {
    type: Boolean,
    default: true
  }
})
</script>

<style scoped>
.fade-overlay-leave-active {
  transition: opacity 0.8s cubic-bezier(0.4, 0, 0.2, 1);
}
.fade-overlay-leave-to {
  opacity: 0;
}

@keyframes progress-bar {
  0% { width: 0%; transform: translateX(-100%); }
  50% { width: 70%; transform: translateX(0); }
  100% { width: 100%; transform: translateX(100%); }
}

.animate-progress-bar {
  animation: progress-bar 2s cubic-bezier(0.65, 0, 0.35, 1) infinite;
}

/* Fallback animations for older browsers */
.animate-in {
  animation-fill-mode: forwards;
}
@keyframes zoom-in {
  from { transform: scale(0.95); opacity: 0; }
  to { transform: scale(1); opacity: 1; }
}
.zoom-in {
  animation: zoom-in 0.8s ease-out;
}
</style>
