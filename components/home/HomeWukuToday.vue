<template>
  <div class="card p-4 bg-elevated border-brand">
    <div class="flex items-start gap-4">
      <div class="text-3xl mt-1 shrink-0">🗓️</div>
      <div class="flex-1 min-w-0">
        <h4 class="font-bold text-sm text-default">Info Saka Hari Ini</h4>
        <div class="text-[10px] text-muted font-medium mb-1">
          {{ kalender.selectedDate.value }} {{ kalender.monthName.value }} {{ kalender.selectedYear.value }}
        </div>
        <div v-if="kalender.isLoading.value" class="h-6 bg-default/5 rounded w-32 animate-pulse mt-1"></div>
        <p v-else class="text-brand font-bold text-lg leading-tight truncate">{{ sakaInfoShort }}</p>

        <!-- Dewasa Ayu Section -->
        <div class="mt-4 pt-4 border-t border-default/5">
          <div class="flex items-center justify-between mb-2">
            <span class="text-[10px] font-bold text-muted uppercase tracking-wider">Dewasa Ayu</span>
            <NuxtLink to="/ala-ayuning-dewasa" class="text-[10px] font-bold text-brand hover:underline flex items-center gap-1">
              Lihat Semua <Icon name="lucide:arrow-right" class="w-3 h-3" />
            </NuxtLink>
          </div>
          
          <div v-if="pendingDewasa" class="flex items-center gap-2 opacity-50 text-[10px]">
            <Icon name="lucide:loader-2" class="w-3 h-3 animate-spin" />
            <span>Memuat...</span>
          </div>
          <div v-else-if="dewasaData?.items?.length" class="flex flex-wrap gap-1.5">
            <div v-for="item in dewasaData.items.slice(0, 3)" :key="item.name" 
                 class="bg-brand/5 border border-brand/10 px-2 py-0.5 rounded text-[10px] font-bold text-brand">
              {{ item.name }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useKalender } from '~/composables/useKalender'

const kalender = useKalender()

// Fetch Dewasa Ayu dynamically (Today)
const dateStr = computed(() => {
  return `?tanggal=${kalender.selectedDate.value}&bulan=${kalender.selectedMonth.value}&tahun=${kalender.selectedYear.value}`
})
const { data: dewasaData, pending: pendingDewasa } = useFetch(() => `/api/dewasa${dateStr.value}`, { lazy: true, server: false })

const sakaInfoShort = computed(() => {
  const info = kalender.selectedDayInfo.value?.sakaInfo
  if (!info) return '-'
  return info
})
</script>
