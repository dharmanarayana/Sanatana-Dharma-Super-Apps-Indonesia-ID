<!-- components/app/AppHeaderMobile.vue -->
<template>
  <header class="app-header fixed top-0 left-0 right-0 z-40 h-[60px]
                 flex items-center px-4 gap-3 safe-top">
    <!-- Back Button (only when not on home) -->
    <button v-if="route.path !== '/'" 
            @click="router.back()"
            class="p-2 -ml-2 rounded-full hover:bg-white/10 active:scale-95 transition-all text-brand"
            aria-label="Kembali">
      <Icon name="lucide:arrow-left" class="w-6 h-6" />
    </button>

    <!-- Logo -->
    <NuxtLink to="/" class="flex items-center gap-2.5 flex-1 active:opacity-70 transition-opacity translate-z-0">
      <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-brand to-gold/80 
                  flex items-center justify-center shadow-lg shadow-brand/20">
        <Icon name="ic:round-om" class="w-7 h-7 text-white" />
      </div>
      <div>
        <p class="font-serif font-bold text-brand text-[15px] leading-tight">
          Sanatana Dharma
        </p>
        <p class="text-muted text-[10px] uppercase tracking-widest font-semibold leading-none">Digital</p>
      </div>
    </NuxtLink>

    <!-- Aksi kanan -->
    <div class="flex items-center gap-1">
      <AppThemeToggle />
      <AppNotificationBell />
    </div>
  </header>
</template>

<script setup lang="ts">
const route = useRoute()
const router = useRouter()
</script>

<style scoped>
.translate-z-0 { transform: translateZ(0); }
</style>
