<template>
  <div class="card p-4 hover:border-brand transition-all cursor-pointer group flex items-center gap-4">
    <div class="w-12 h-12 rounded-2xl bg-brand/5 flex items-center justify-center text-brand group-hover:bg-brand group-hover:text-white transition-all shadow-sm">
      <Icon name="lucide:scroll-text" size="20" />
    </div>
    <div class="flex-1 min-w-0">
      <h4 class="font-bold text-default group-hover:text-brand transition-colors truncate text-lg">
        {{ doa.title }}
      </h4>
      <p class="text-sm text-muted font-bold uppercase tracking-widest mt-1">
        {{ doa.category }}
      </p>
    </div>
    <Icon name="lucide:chevron-right" size="16" class="text-muted group-hover:translate-x-1 transition-transform" />
  </div>
</template>

<script setup lang="ts">
defineProps<{
  doa: any
}>()
</script>
