<template>
  <Transition name="slide-down">
    <div v-if="!isOnline" class="fixed top-[60px] lg:top-[64px] left-0 right-0 z-[100] px-4 py-3">
      <div class="max-w-xl mx-auto bg-brand/90 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl shadow-brand/20 flex items-center justify-between p-4 gap-4">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 bg-white/20 rounded-2xl flex items-center justify-center shrink-0">
            <Icon name="tabler:wifi-off" class="w-6 h-6 text-white" />
          </div>
          <div class="flex-1 min-w-0">
            <p class="text-xs font-black uppercase tracking-widest text-white/70 mb-0.5">Offline Mode</p>
            <p class="text-sm font-bold text-white line-clamp-1">Koneksi terputus.</p>
          </div>
        </div>
        <button @click="refreshPage" class="px-5 py-2.5 bg-white text-brand text-xs font-black uppercase tracking-widest rounded-2xl hover:bg-brand-secondary hover:text-white transition-all active:scale-95 shadow-inner">
          Coba Lagi
        </button>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
const { isOnline, refreshPage } = useNetworkStatus()
</script>

<style scoped>
.slide-down-enter-active,
.slide-down-leave-active {
  transition: all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.slide-down-enter-from,
.slide-down-leave-to {
  transform: translateY(-100%) scale(0.9);
  opacity: 0;
}
</style>
