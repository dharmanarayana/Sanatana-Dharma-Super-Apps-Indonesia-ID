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


    <!-- Breadcrumb -->
    <AppBreadcrumb class="flex-1" />


    <!-- Actions -->
    <div class="flex items-center gap-2">
      <AppThemeToggle />
      <AppNotificationBell />
    </div>
  </header>
</template>
