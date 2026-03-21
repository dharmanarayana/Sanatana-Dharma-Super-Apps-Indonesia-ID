<template>
  <header class="fixed top-0 left-0 right-0 h-[60px] bg-surface/80 backdrop-blur-md 
                 border-b border-default z-40 flex items-center justify-between px-4 safe-top">
    <NuxtLink to="/" class="flex items-center gap-2.5 active:opacity-70 transition-opacity">
      <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-brand to-gold/80 
                  flex items-center justify-center shadow-lg shadow-brand/20">
        <Icon name="ic:round-om" class="w-7 h-7 text-white" />
      </div>
      <h1 class="font-serif font-bold text-brand text-[17px] leading-[1.1]">
        Sanatana Dharma<br/>
        <span class="text-[10px] font-sans font-semibold text-muted uppercase tracking-widest">Digital</span>
      </h1>
    </NuxtLink>
    
    <div class="flex items-center gap-3">
      <!-- Theme Toggle Component -->
      <AppThemeToggle />

      <AppNotificationBell />
      
      <NuxtLink to="/profil" class="w-9 h-9 rounded-full bg-[var(--state-active)] border border-brand/20 flex items-center justify-center overflow-hidden">
        <Icon name="lucide:user" class="w-5 h-5 text-brand" />
      </NuxtLink>
    </div>
  </header>
</template>

<script setup>
const colorMode = useColorMode()

const toggleTheme = () => {
  colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark'
}
</script>
