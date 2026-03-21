<!-- components/ui/UiGrid.vue -->
<script setup lang="ts">
defineProps<{
  cols?: '2' | '3' | '4'     // kolom maksimal di desktop
  gap?: 'sm' | 'md' | 'lg'   // jarak antar item
}>()
</script>

<template>
  <div
    class="grid grid-cols-1"
    :class="[
      // Gap
      gap === 'sm' ? 'gap-3'      :
      gap === 'lg' ? 'gap-6'      : 'gap-4',
      // Kolom desktop
      cols === '2' ? 'lg:grid-cols-2'      :
      cols === '4' ? 'lg:grid-cols-4'      :
      'lg:grid-cols-3'
    ]"
  >
    <slot />
  </div>
</template>
