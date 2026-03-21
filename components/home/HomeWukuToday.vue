<template>
  <div class="card p-4 bg-elevated border-brand">
    <div class="flex items-start gap-3">
      <div class="text-3xl mt-1">🗓️</div>
      <div>
        <h4 class="font-bold text-sm text-default">Info Saka Hari Ini</h4>
        <div class="text-xs text-muted font-medium mb-1">
          {{ kalender.selectedDate.value }} {{ kalender.monthName.value }} {{ kalender.selectedYear.value }}
        </div>
        <div v-if="kalender.isLoading.value" class="h-6 bg-default rounded w-32 animate-pulse mt-1"></div>
        <p v-else class="text-brand font-bold text-lg leading-tight">{{ sakaInfoShort }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useKalender } from '~/composables/useKalender'

const kalender = useKalender()

const sakaInfoShort = computed(() => {
  const info = kalender.selectedDayInfo.value?.sakaInfo
  if (!info) return '-'
  // Ex: "Purnama Kepitu, Anggara Umanis Wayang"
  return info
})
</script>
