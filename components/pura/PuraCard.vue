<template>
  <div class="card p-4 hover:border-brand/40 transition-colors group cursor-pointer h-full flex flex-col">
    <div class="aspect-video bg-muted rounded-xl mb-3 overflow-hidden shrink-0">
      <img v-if="temple.image" :src="temple.image" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
      <div v-else class="w-full h-full flex items-center justify-center opacity-20">
        <Icon name="lucide:map-pin" size="48" />
      </div>
    </div>
    <div class="flex-1 min-w-0">
      <div class="flex justify-between items-start mb-2">
        <h4 class="font-bold text-default text-base line-clamp-1">{{ temple.name }}</h4>
        <span class="text-xs font-bold text-brand bg-brand/10 px-2 py-0.5 rounded">PURA</span>
      </div>
      <p class="text-sm text-muted flex items-center gap-1 mb-4 line-clamp-1">
        <Icon name="lucide:navigation" size="12" />
        {{ temple.location }}
      </p>
    </div>
    <div class="flex gap-2 mt-auto">
      <button class="flex-1 btn-primary py-2.5 text-sm uppercase font-bold justify-center">Detail Pura</button>
      <button class="w-12 h-12 rounded-lg bg-surface-variant flex items-center justify-center hover:bg-brand/10 transition-colors text-xl">
        <Icon name="lucide:map" size="20" class="text-secondary" />
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  temple: any
}>()
</script>
