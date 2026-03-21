<template>
  <header class="fixed top-0 left-0 right-0 h-[60px] bg-surface/80 backdrop-blur-md 
                 border-b border-default z-40 flex items-center justify-between px-4 safe-top">
    <div class="flex items-center gap-2">
      <span class="text-2xl">🕉️</span>
      <h1 class="font-serif font-bold text-brand text-lg leading-tight">
        Sanatana Dharma<br/>
        <span class="text-xs font-sans font-medium text-muted uppercase tracking-wider">Digital</span>
      </h1>
    </div>
    
    <div class="flex items-center gap-3">
      <!-- Theme Toggle Component -->
      <AppThemeToggle />

      <button class="p-2 rounded-full hover:bg-elevated active:scale-95 transition-all">
        <Icon name="lucide:bell" class="w-6 h-6 text-muted" />
      </button>
      
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
