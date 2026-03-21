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
      <span class="text-lg">☰</span>
    </button>

    <!-- Breadcrumb -->
    <AppBreadcrumb class="flex-1" />

    <!-- Search bar desktop (lebih lebar) -->
    <div class="relative w-72">
      <input type="search"
             placeholder="Cari doa, kitab, berita..."
             class="input-field pl-10 pr-4 py-2 text-sm" />
      <span class="absolute left-3 top-1/2 -translate-y-1/2 text-muted text-base">🔍</span>
    </div>

    <!-- Actions -->
    <div class="flex items-center gap-2">
      <AppThemeToggle />
      <AppNotificationBell />
    </div>
  </header>
</template>
