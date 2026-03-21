<!-- components/app/AppHeaderMobile.vue -->
<template>
  <header class="app-header fixed top-0 left-0 right-0 z-40 h-[60px]
                 flex items-center px-4 gap-3 safe-top">
    <!-- Logo -->
    <div class="flex items-center gap-2 flex-1">
      <span class="text-2xl">🕉️</span>
      <div>
        <p class="font-serif font-bold text-brand text-base leading-tight">
          Sanatana Dharma
        </p>
        <p class="text-muted text-[10px] leading-none">Digital</p>
      </div>
    </div>
    <!-- Aksi kanan -->
    <div class="flex items-center gap-1">
      <AppThemeToggle />
      <AppNotificationBell />
    </div>
  </header>
</template>
