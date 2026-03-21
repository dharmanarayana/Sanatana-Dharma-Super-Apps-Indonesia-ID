<template>
  <div class="grid grid-cols-3 gap-4">
    <div v-for="s in statItems" :key="s.label" class="text-center card py-3 bg-surface/50 border-default border">
      <p class="text-xl font-black italic" :class="s.color || 'text-brand'">{{ s.value }}</p>
      <p class="text-[9px] font-bold text-muted uppercase tracking-tighter">{{ s.label }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  stats: {
    points: number
    donations: number
    badges: number
    streak: number
  }
}>()

const statItems = computed(() => [
  { label: 'Point', value: props.stats.points },
  { label: 'Punia', value: props.stats.donations, color: 'text-error' },
  { label: 'Badge', value: props.stats.badges, color: 'text-brand-gold' }
])
</script>
