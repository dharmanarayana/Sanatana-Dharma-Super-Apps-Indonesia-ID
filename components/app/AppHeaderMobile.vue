<!-- components/app/AppHeaderMobile.vue -->
<template>
  <header class="app-header fixed top-0 left-0 right-0 z-40 h-[60px]
                 flex items-center px-4 gap-3 safe-top">


    <!-- Back Button (only when not on home) -->
    <button v-if="route.path !== '/' && route.path !== ''" 
            @click="router.back()"
            class="flex items-center gap-1 p-2 -ml-2 rounded-full hover:bg-white/10 active:scale-95 transition-all text-brand font-bold"
            aria-label="Kembali">
      <Icon name="lucide:chevron-left" class="w-6 h-6" />
      <span class="text-base pr-2">Kembali</span>
    </button>

    <!-- Logo -->
    <NuxtLink to="/" class="flex items-center gap-2.5 flex-1 active:opacity-70 transition-opacity translate-z-0">
      <div v-if="route.path === '/' || route.path === ''" class="w-10 h-10 rounded-xl bg-gradient-to-br from-brand to-gold/80 
                  flex items-center justify-center shadow-lg shadow-brand/20">
        <Icon name="fa6-solid:om" class="w-7 h-7 text-white" />
      </div>
      <div v-if="route.path === '/' || route.path === ''">
        <p class="font-serif font-bold text-brand text-lg leading-tight">
          Sanatana Dharma
        </p>
        <p class="text-muted text-xs uppercase tracking-widest font-semibold leading-none">Digital</p>
      </div>
    </NuxtLink>

    <!-- Aksi kanan -->
    <div class="flex items-center gap-2">
      <AppThemeToggle />
      <AppNotificationBell />

      <ClientOnly>
        <NuxtLink v-if="!authStore.isLoggedIn" 
                  to="/login" 
                  class="flex items-center gap-2 px-3 py-1.5 bg-surface shadow-sm border border-default rounded-full active:scale-95 transition-all">
          <div class="w-6 h-6 rounded-full bg-brand/10 flex items-center justify-center">
            <Icon name="lucide:user" class="w-4 h-4 text-brand" />
          </div>
          <span class="text-sm font-bold text-default">Masuk / Daftar</span>
        </NuxtLink>

        <NuxtLink v-else 
                  to="/profil" 
                  class="flex items-center gap-2 pl-3 pr-1 py-1 bg-surface border border-brand/20 rounded-full active:scale-95 transition-all shadow-sm">
          <span class="text-[11px] font-bold text-brand">Hai, {{ firstName }}!</span>
          <div class="w-7 h-7 rounded-full bg-brand flex items-center justify-center overflow-hidden">
            <Icon name="lucide:user" class="w-4 h-4 text-white" />
          </div>
        </NuxtLink>
      </ClientOnly>
    </div>
  </header>
</template>

<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'
const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()

const firstName = computed(() => {
  return authStore.user?.name?.split(' ')[0] || 'User'
})
</script>

<style scoped>
.translate-z-0 { transform: translateZ(0); }
</style>
