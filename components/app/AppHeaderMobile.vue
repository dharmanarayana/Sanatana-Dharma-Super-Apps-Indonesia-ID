<!-- components/app/AppHeaderMobile.vue -->
<template>
  <header class="app-header fixed top-0 left-0 right-0 z-40 h-[60px]
                 flex items-center px-4 gap-3 safe-top">
    <!-- Logo -->
    <div class="flex items-center gap-2.5 flex-1">
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
    </div>
    <!-- Aksi kanan -->
    <div class="flex items-center gap-1">
      <AppThemeToggle />
      <AppNotificationBell />
    </div>
  </header>
</template>
