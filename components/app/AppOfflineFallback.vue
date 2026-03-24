<template>
  <div class="fixed inset-0 z-[100] bg-base flex flex-col items-center justify-center p-8 text-center animate-fade-in">
    <!-- Premium Illustration -->
    <div class="relative mb-10">
      <div class="w-32 h-32 bg-brand/10 rounded-full flex items-center justify-center animate-pulse">
        <Icon name="tabler:wifi-off" class="w-16 h-16 text-brand" />
      </div>
      <div class="absolute -top-2 -right-2 w-8 h-8 bg-surface border border-brand/20 rounded-xl flex items-center justify-center shadow-lg">
        <Icon name="lucide:alert-triangle" class="text-brand w-4 h-4" />
      </div>
    </div>

    <!-- Message -->
    <h2 class="text-3xl font-serif font-bold text-default mb-4 tracking-tight">Sedang Offline</h2>
    <p class="text-muted text-sm leading-relaxed max-w-[280px] mb-10">
      Maaf, fitur ini belum mendukung mode offline. Mohon aktifkan internet Anda untuk melihat halaman ini.
    </p>

    <!-- Call to Action -->
    <div class="flex flex-col gap-3 w-full max-w-[240px]">
      <button @click="retryConnection" 
              class="w-full bg-brand text-inverse py-4 rounded-2xl font-bold shadow-lg shadow-brand/20 active:scale-95 transition-all">
        Coba Lagi
      </button>
      <NuxtLink to="/" 
                class="w-full bg-surface border border-default py-4 rounded-2xl font-bold text-default active:scale-95 transition-all text-sm">
        Kembali ke Beranda
      </NuxtLink>
    </div>

    <!-- Tips -->
    <div class="mt-12 p-4 bg-brand/5 rounded-2xl max-w-[300px]">
       <p class="text-[10px] font-bold text-brand uppercase tracking-widest mb-2 flex items-center justify-center gap-1">
          <Icon name="lucide:info" size="12" />
          Info Mode Offline
       </p>
       <p class="text-[10px] text-muted italic">
          Fitur Doa & Mantra, Kitab Suci, dan Kalender sudah mendukung mode offline sepenuhnya.
       </p>
    </div>
  </div>
</template>

<script setup lang="ts">
const retryConnection = () => {
  window.location.reload()
}
</script>

<style scoped>
@keyframes fade-in {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
.animate-fade-in {
  animation: fade-in 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}
</style>
