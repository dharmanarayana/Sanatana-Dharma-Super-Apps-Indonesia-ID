<template>
  <div class="fixed inset-0 bg-base flex flex-col items-center justify-center p-8 text-center bg-[#FFF8F0] dark:bg-charcoal transition-colors duration-500">
    <div class="relative mb-10 scale-110">
      <div class="w-32 h-32 bg-brand/10 rounded-full flex items-center justify-center animate-pulse">
        <Icon name="tabler:wifi-off" class="w-16 h-16 text-brand" />
      </div>
      <div class="absolute -top-2 -right-2 w-8 h-8 bg-surface border border-brand/20 rounded-xl flex items-center justify-center shadow-lg">
        <Icon name="lucide:zap" class="text-brand w-4 h-4 animate-bounce" />
      </div>
    </div>

    <h2 class="text-4xl font-serif font-bold text-default mb-4 tracking-tight">Koneksi Terputus</h2>
    <p class="text-muted text-sm leading-relaxed max-w-[300px] mb-12">
      Aplikasi tetap berjalan dalam mode offline untuk fitur utama. Beberapa fitur interaktif mungkin memerlukan internet.
    </p>

    <div class="flex flex-col gap-4 w-full max-w-[280px]">
      <NuxtLink to="/" 
                class="w-full bg-brand text-inverse py-4 rounded-2xl font-bold shadow-xl shadow-brand/20 active:scale-95 transition-all flex items-center justify-center gap-2">
        <Icon name="lucide:home" />
        Buka Beranda Offline
      </NuxtLink>
      <button @click="retry" 
              class="w-full bg-surface border border-default py-4 rounded-2xl font-bold text-default active:scale-95 transition-all text-sm">
        Coba Segarkan Halaman
      </button>
    </div>
    
    <div class="mt-16 opacity-30 flex items-center gap-2 text-xs font-serif italic text-muted">
       <span>Sanatana Dharma Digital</span>
       <span class="w-1 h-1 bg-muted rounded-full"></span>
       <span>Offline Shell v1.0</span>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: false
})

const retry = () => {
  window.location.reload()
}
</script>
