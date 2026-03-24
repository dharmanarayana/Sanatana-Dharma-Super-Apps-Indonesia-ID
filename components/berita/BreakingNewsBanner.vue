<template>
  <div class="bg-brand text-white p-3 rounded-xl flex items-center gap-3">
    <span class="font-bold whitespace-nowrap">BREAKING:</span>
    <marquee v-if="latestNews" class="text-sm">
      {{ latestNews.title }} &mdash; {{ latestNews.author }}
    </marquee>
    <marquee v-else class="text-sm">
      Memuat kabar terbaru...
    </marquee>
  </div>
</template>

<script setup lang="ts">
const { newsItems, fetchNews, subscribe, stop } = useRealtimeNews()

const latestNews = computed(() => newsItems.value[0] || null)

onMounted(async () => {
  await fetchNews(1)
  subscribe()
})

onUnmounted(stop)
</script>
