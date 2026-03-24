```html
<template>
  <div class="card p-3 flex gap-4 hover:border-brand/30 transition-all cursor-pointer group relative">
    <!-- Save Button -->
    <div class="absolute top-2 right-2 z-10">
      <AppSaveButton :item="news" type="news" :path="`/berita/${news.$id}`" size="sm" />
    </div>
    <div class="w-24 h-24 bg-surface-variant overflow-hidden rounded-xl shrink-0">
      <NuxtImg v-if="news.image" :src="news.image" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" loading="lazy" />
      <div v-else class="w-full h-full flex items-center justify-center opacity-20">
        <Icon name="lucide:newspaper" size="32" />
      </div>
    </div>
    <div class="flex-1 min-w-0 flex flex-col justify-center">
      <div class="flex items-center gap-2 mb-1">
        <span class="text-xs font-bold text-brand bg-brand/10 px-2 py-0.5 rounded uppercase">{{ news.category }}</span>
        <span class="text-xs text-muted">{{ formatDate(news.publishedAt) }}</span>
      </div>
      <h4 class="font-bold text-default line-clamp-2 text-base leading-tight group-hover:text-brand transition-colors">
        {{ news.title }}
      </h4>
      <p class="text-xs text-muted mt-2 flex items-center gap-1">
        <Icon name="lucide:user" size="12" />
        {{ news.author }}
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  news: any
}>()

const formatDate = (dateStr: string) => {
  if (!dateStr) return ''
  const date = new Date(dateStr)
  return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })
}
</script>
