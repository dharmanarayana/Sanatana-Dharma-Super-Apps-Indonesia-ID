<!-- components/app/AppHeaderDesktop.vue -->
<script setup lang="ts">
defineEmits(['toggle-sidebar'])
</script>

<template>
  <header class="app-header sticky top-0 z-30 h-16
                 flex items-center px-6 gap-4">

    <!-- Tombol toggle sidebar -->
    <button @click="$emit('toggle-sidebar')"
            class="btn-ghost p-2 rounded-lg" aria-label="Toggle navigasi">
      <Icon name="lucide:menu" class="w-5 h-5" />
    </button>

    <!-- Logo link to home -->
    <NuxtLink to="/" class="flex items-center gap-2 active:opacity-70 transition-opacity mr-2">
      <div class="w-8 h-8 rounded-lg bg-gradient-to-br from-brand to-gold/80 flex items-center justify-center">
        <Icon name="ic:round-om" class="w-5 h-5 text-white" />
      </div>
      <span class="font-serif font-bold text-brand text-sm hidden xl:inline">Sanatana Dharma</span>
    </NuxtLink>

    <!-- Breadcrumb -->
    <AppBreadcrumb class="flex-1" />

    <!-- Search bar desktop (lebih lebar) -->
    <div class="relative w-72">
      <input type="search"
             placeholder="Cari doa, kitab, berita..."
             class="input-field pl-10 pr-4 py-2 text-sm" />
      <Icon name="lucide:search" class="absolute left-3 top-1/2 -translate-y-1/2 text-muted w-4 h-4" />
    </div>

    <!-- Actions -->
    <div class="flex items-center gap-2">
      <AppThemeToggle />
      <AppNotificationBell />
    </div>
  </header>
</template>
