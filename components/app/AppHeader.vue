<template>
  <header class="fixed top-0 left-0 right-0 h-[60px] bg-surface/80 backdrop-blur-md 
                 border-b border-default z-[100] flex items-center justify-between px-4 safe-top">
    <NuxtLink to="/" class="flex items-center gap-2.5 active:opacity-70 transition-opacity">
      <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-brand to-gold/80 
                  flex items-center justify-center shadow-lg shadow-brand/20">
        <Icon name="fa6-solid:om" class="w-7 h-7 text-white" />
      </div>
      <h1 class="font-serif font-bold text-brand text-[17px] leading-[1.1]">
        Sanatana Dharma<br/>
        <span class="text-[10px] font-sans font-semibold text-muted uppercase tracking-widest">Digital</span>
      </h1>
    </NuxtLink>
    
    <div class="flex items-center gap-3">
      <ClientOnly>
        <button @click="openSearch" class="p-2 rounded-lg hover:bg-default/5 text-muted hover:text-brand transition-all" aria-label="Cari">
          <Icon name="lucide:search" class="w-5 h-5" />
        </button>
        <AppThemeToggle />
        <AppNotificationBell />
        
        <NuxtLink v-if="!authStore.isLoggedIn" 
                  to="/login" 
                  class="flex items-center gap-2 px-4 py-2 bg-surface shadow-sm border border-default rounded-full hover:bg-default/5 transition-all active:scale-95">
          <div class="w-6 h-6 rounded-full bg-brand/10 flex items-center justify-center">
            <Icon name="lucide:user" class="w-4 h-4 text-brand" />
          </div>
          <span class="text-sm font-bold text-default">{{ $t('profile.login') }}</span>
        </NuxtLink>

        <NuxtLink v-else to="/profil" class="flex items-center gap-2 pl-3 pr-1 py-1 bg-surface border border-brand/20 rounded-full active:scale-95 transition-all shadow-sm">
          <span class="text-[11px] font-bold text-brand">Hai, {{ firstName }}!</span>
          <div class="w-7 h-7 rounded-full bg-brand flex items-center justify-center overflow-hidden">
            <Icon name="lucide:user" class="w-4 h-4 text-white" />
          </div>
        </NuxtLink>

        <template #fallback>
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-full bg-default/5 animate-pulse" />
            <div class="w-10 h-10 rounded-full bg-default/5 animate-pulse" />
            <div class="w-9 h-9 rounded-full bg-default/5 animate-pulse" />
          </div>
        </template>
      </ClientOnly>
    </div>
  </header>
</template>

<script setup>
const authStore = useAuthStore()
const colorMode = useColorMode()
const { openSearch } = useGlobalSearch()

const firstName = computed(() => {
  return authStore.user?.name?.split(' ')[0] || 'User'
})

const toggleTheme = () => {
  colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark'
}
</script>
