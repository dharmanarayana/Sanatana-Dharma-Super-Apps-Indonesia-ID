<template>
  <div class="card overflow-hidden group cursor-pointer hover:border-brand/40 transition-all flex flex-col h-full">
    <div class="aspect-[3/4] bg-surface-variant relative overflow-hidden shrink-0">
      <NuxtImg v-if="kitab.coverImage" :src="kitab.coverImage" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" loading="lazy" />
      <div v-else class="w-full h-full flex items-center justify-center text-maroon text-4xl opacity-10">📖</div>
      <div class="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/80 via-black/40 to-transparent">
        <span class="text-xs font-bold text-brand bg-brand/10 px-2 py-0.5 rounded uppercase mb-2 inline-block backdrop-blur-sm">
          {{ kitab.category }}
        </span>
        <p class="text-white font-black italic text-base leading-tight group-hover:text-brand transition-colors">
          {{ kitab.title }}
        </p>
      </div>
    </div>
    <div class="p-3 mt-auto bg-surface">
      <div class="flex items-center justify-between text-xs text-muted font-bold">
        <span class="flex items-center gap-1">
          <Icon name="lucide:layout-list" size="12" />
          DETAIL KITAB
        </span>
        <Icon name="lucide:chevron-right" size="14" class="group-hover:translate-x-1 transition-transform" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  kitab: any
}>()
</script>
