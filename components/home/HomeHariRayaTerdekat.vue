<template>
  <div class="card p-4 border-l-4 border-brand-secondary">
    <div class="flex items-center gap-2 mb-3">
      <Icon name="lucide:calendar-check" class="w-5 h-5 text-brand" />
      <h4 class="font-bold text-default text-sm font-serif">Jadwal Hari Raya Mendatang</h4>
    </div>
    
    <div v-if="kalender.isLoading.value" class="space-y-3 mt-3">
      <div class="h-4 bg-default rounded w-full animate-pulse"></div>
      <div class="h-4 bg-default rounded w-3/4 animate-pulse"></div>
    </div>
    
    <div v-else-if="upcomingEvents.length > 0" class="space-y-2 mt-3 text-sm">
      <div v-for="(event, i) in upcomingEvents.slice(0, 3)" :key="i">
        <div class="flex items-center justify-between">
          <span class="font-bold pr-2 truncate">{{ event.name }}</span>
          <span class="text-xs text-muted whitespace-nowrap bg-default px-2 py-0.5 rounded-full">
            {{ event.daysLeft === 0 ? 'Hari Ini' : event.daysLeft === 1 ? 'Besok' : `${event.daysLeft} hari lagi` }}
          </span>
        </div>
        <div v-if="i < Math.min(upcomingEvents.length, 3) - 1" class="divider my-2 opacity-50"></div>
      </div>
    </div>
    
    <div v-else class="text-sm text-muted italic mt-3">
      Tidak ada hari raya dalam waktu dekat bulan ini.
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useKalender } from '~/composables/useKalender'

const kalender = useKalender()

const upcomingEvents = computed(() => {
  const today = kalender.selectedDate.value // This defaults to current day of month on load
  const rerainan = kalender.currentReligiousDays.value || []
  
  // Combine religious and holidays if you want, or just religious. Let's do both
  const holidays = kalender.currentHolidays.value || []
  const all = [...rerainan, ...holidays].filter(e => e.date >= today)
  
  // Sort by date ascending
  all.sort((a, b) => a.date - b.date)
  
  // Remove precise duplicate names arriving on same date
  const unique = []
  const seen = new Set()
  all.forEach(item => {
    const key = `${item.date}-${item.name}`
    if (!seen.has(key)) {
      unique.push({
        ...item,
        daysLeft: item.date - today
      })
      seen.add(key)
    }
  })
  
  return unique
})
</script>
