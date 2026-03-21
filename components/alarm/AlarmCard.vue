<script setup lang="ts">
defineProps<{ waktu: string }>()
</script>
<template>
  <div class="card p-4 flex items-center justify-between">
    <div class="flex items-center gap-3">
      <div class="text-2xl">⏰</div>
      <div>
        <h4 class="font-bold text-sm capitalize">Tri Sandhya {{ waktu }}</h4>
        <p class="text-xs text-muted">06:00 WITA</p>
      </div>
    </div>
    <div class="w-12 h-6 bg-state-active rounded-full relative">
      <div class="absolute left-1 top-1 w-4 h-4 bg-brand rounded-full"></div>
    </div>
  </div>
</template>
