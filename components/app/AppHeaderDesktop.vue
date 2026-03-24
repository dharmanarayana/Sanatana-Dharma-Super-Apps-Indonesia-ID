<script setup lang="ts">
defineEmits(['toggle-sidebar'])
const { openSearch } = useGlobalSearch()
</script>

<template>
  <header class="app-header sticky top-0 z-30 h-16
                 flex items-center px-6 gap-4">

    <!-- Tombol toggle sidebar -->
    <button @click="$emit('toggle-sidebar')"
            class="btn-ghost p-2 rounded-lg" aria-label="Toggle navigasi">
      <Icon name="lucide:menu" class="w-5 h-5" />
    </button>


    <!-- Breadcrumb -->
    <AppBreadcrumb class="flex-1" />


    <!-- Actions -->
    <div class="flex items-center gap-2">
      <button @click="openSearch" class="p-2 rounded-lg hover:bg-default/5 text-muted hover:text-brand transition-all" aria-label="Cari">
        <Icon name="lucide:search" class="w-5 h-5" />
      </button>
      <AppThemeToggle />
      <AppNotificationBell />
    </div>
  </header>
</template>
