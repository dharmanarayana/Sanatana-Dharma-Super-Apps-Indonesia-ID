<!-- components/app/AppHeaderMobile.vue -->
<template>
  <header class="app-header fixed top-0 left-0 right-0 z-40 h-[60px]
                 flex items-center px-4 gap-3 safe-top">


    <!-- Back Button (only when not on home) -->
    <button v-if="route.path !== '/'" 
            @click="router.back()"
            class="flex items-center gap-1 p-2 -ml-2 rounded-full hover:bg-white/10 active:scale-95 transition-all text-brand font-bold"
            aria-label="Kembali">
      <Icon name="lucide:chevron-left" class="w-6 h-6" />
      <span class="text-sm pr-2">Kembali</span>
    </button>

    <!-- Logo -->
    <NuxtLink to="/" class="flex items-center gap-2.5 flex-1 active:opacity-70 transition-opacity translate-z-0">
      <div v-if="route.path === '/'" class="w-10 h-10 rounded-xl bg-gradient-to-br from-brand to-gold/80 
                  flex items-center justify-center shadow-lg shadow-brand/20">
        <Icon name="material-symbols:om" class="w-7 h-7 text-white" />
      </div>
      <div v-if="route.path === '/'">
        <p class="font-serif font-bold text-brand text-[15px] leading-tight">
          Sanatana Dharma
        </p>
        <p class="text-muted text-[10px] uppercase tracking-widest font-semibold leading-none">Digital</p>
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
          <div class="w-5 h-5 rounded-full bg-brand/10 flex items-center justify-center">
            <Icon name="lucide:user" class="w-3.5 h-3.5 text-brand" />
          </div>
          <span class="text-xs font-bold text-default">Login</span>
        </NuxtLink>

        <NuxtLink v-else 
                  to="/profil" 
                  class="w-9 h-9 rounded-full bg-[var(--state-active)] border border-brand/20 flex items-center justify-center overflow-hidden active:scale-95 transition-all">
          <Icon name="lucide:user" class="w-5 h-5 text-brand" />
        </NuxtLink>
      </ClientOnly>
    </div>
  </header>
</template>

<script setup lang="ts">
const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()
</script>

<style scoped>
.translate-z-0 { transform: translateZ(0); }
</style>
