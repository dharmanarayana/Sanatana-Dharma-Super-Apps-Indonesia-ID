<template>
  <div class="card p-4 flex gap-4 hover:border-brand/30 transition-all cursor-pointer group">
    <div class="w-24 h-24 bg-surface-variant rounded-xl shrink-0 overflow-hidden relative">
      <NuxtImg v-if="item.coverImage" :src="item.coverImage" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" loading="lazy" />
      <div v-else class="w-full h-full flex items-center justify-center opacity-20">
        <Icon name="lucide:book-open" size="32" />
      </div>
      <div v-if="item.fileUrl" class="absolute bottom-1 right-1 bg-brand text-white p-1 rounded-lg shadow-lg">
        <Icon name="lucide:file-text" size="12" />
      </div>
    </div>
    <div class="flex-1 min-w-0">
      <div class="flex items-center gap-2 mb-1">
        <span class="text-xs font-bold text-brand bg-brand/10 px-2 py-0.5 rounded uppercase">{{ item.category }}</span>
      </div>
      <h4 class="font-bold text-default line-clamp-2 text-base leading-tight group-hover:text-brand transition-colors">
        {{ item.title }}
      </h4>
      <p class="text-sm text-muted mt-2 line-clamp-2">
        {{ item.description || 'Tidak ada deskripsi.' }}
      </p>
      <div class="flex items-center gap-2 mt-2">
        <Icon name="lucide:user" size="12" class="text-muted" />
        <span class="text-xs text-muted">{{ item.author }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  item: any
}>()
</script>
