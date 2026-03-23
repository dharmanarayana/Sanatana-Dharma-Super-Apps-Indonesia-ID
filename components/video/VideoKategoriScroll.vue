<template>
  <div class="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
    <button v-for="c in categories" :key="c"
            @click="$emit('select', c)"
            :class="[
              'badge whitespace-nowrap px-4 py-2 transition-all',
              active === c ? 'bg-brand text-white' : 'bg-surface border border-default text-muted'
            ]">
      {{ c }}
    </button>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  categories: string[]
  active: string
}>()

defineEmits(['select'])
</script>
