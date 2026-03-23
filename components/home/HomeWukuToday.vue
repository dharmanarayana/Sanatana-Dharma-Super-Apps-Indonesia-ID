<template>
  <div class="card p-4 bg-elevated border-brand">
    <div class="flex items-start gap-4">
      <div class="text-3xl mt-1 shrink-0">🗓️</div>
      <div class="flex-1 min-w-0">
        <h4 class="font-bold text-sm text-default mb-1">Dewasa Ayu Hari Ini</h4>
        <div v-if="kalender.isLoading" class="h-6 bg-default/5 rounded w-32 animate-pulse mt-1"></div>

        <!-- Dewasa Ayu Section -->
        <div class="mt-1">
          
          <div v-if="pendingDewasa" class="flex items-center gap-2 opacity-50 text-[10px]">
            <Icon name="lucide:loader-2" class="w-3 h-3 animate-spin" />
            <span>Memuat...</span>
          </div>
          <div v-else-if="dewasaData?.items?.length" class="space-y-1">
            <div class="flex flex-wrap gap-x-1 gap-y-1 text-xs font-semibold text-default/80 leading-relaxed">
              <span v-for="(item, idx) in dewasaData.items" :key="item.name">
                {{ item.name }}{{ idx < dewasaData.items.length - 1 ? ',' : '' }}
              </span>
            </div>
            <NuxtLink to="/ala-ayuning-dewasa" class="inline-block mt-2 text-[11px] font-bold text-brand hover:text-maroon transition-colors py-1 px-2 bg-brand/5 rounded-md border border-brand/10">
              Silahkan klik di sini untuk penjelasan lengkapnya...
            </NuxtLink>
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

const { data: dewasaData, pending: pendingDewasa } = useFetch(
  () => `/api/dewasa${dateStr.value}`, 
  { 
    key: `dewasa-today-${dateStr.value}`,
    lazy: true, 
    server: false 
  }
)

const sakaInfoShort = computed(() => {
  const info = kalender.selectedDayInfo.value?.sakaInfo
  if (!info) return '-'
  return info
})
</script>
