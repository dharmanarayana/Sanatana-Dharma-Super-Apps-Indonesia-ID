<template>
  <div class="card p-4 border-l-4 border-brand-secondary">
    <div class="flex items-center gap-2 mb-4">
      <Icon name="lucide:calendar-check" class="w-6 h-6 text-brand" />
      <h4 class="font-bold text-default text-base font-serif">Jadwal Hari Suci Hindu</h4>
    </div>
    
    <div v-if="!currentMonthData?.days?.length" class="space-y-3 mt-3">
      <div class="h-4 bg-default rounded w-full animate-pulse"></div>
      <div class="h-4 bg-default rounded w-3/4 animate-pulse"></div>
    </div>
    
    <div v-else-if="upcomingEvents?.length > 0" class="space-y-4 mt-4">
      <div v-for="(event, i) in upcomingEvents.slice(0, 3)" :key="i" class="group/item">
        <div class="flex items-start justify-between gap-3">
          <div class="flex-1 min-w-0">
            <div class="flex items-center gap-1.5 mb-1">
               <span :class="['text-xs font-black uppercase px-2 py-0.5 rounded-md tracking-tighter shadow-sm', event.cat.color]">
                {{ event.cat.label }}
              </span>
            </div>
            <p class="font-bold text-base text-default truncate">{{ event.name }}</p>
          </div>
          <span class="text-sm font-bold text-muted whitespace-nowrap bg-default/50 px-2 py-1.5 rounded-lg border border-default">
            {{ event.daysLeft === 0 ? 'Hari Ini' : event.daysLeft === 1 ? 'Besok' : `${event.daysLeft} hari` }}
          </span>
        </div>
      </div>
    </div>
    
    <div v-else class="text-sm text-muted italic mt-3">
      Tidak ada hari raya dalam waktu dekat bulan ini.
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import dayjs from 'dayjs'
import { useKalender } from '~/composables/useKalender'

const kalender = useKalender()
const currentMonthData = kalender.currentMonthData
const realToday = dayjs()
const todayDate = realToday.date()

const upcomingEvents = computed(() => {
  const rerainan = kalender.currentReligiousDays.value || []
  const holidays = kalender.currentHolidays.value || []
  
  // Helper to categorize inside the computed
  const getCat = (name: string, isRerainan: boolean) => {
    if (isRerainan) return { label: 'Rerainan', color: 'bg-red-100 text-red-600 dark:bg-red-900/40 dark:text-red-300' }
    const n = name.toLowerCase()
    if (n.includes('cuti bersama')) return { label: 'Cuti', color: 'bg-teal-100 text-teal-600 dark:bg-teal-900/40 dark:text-teal-300' }
    
    const liburKeywords = ['tahun baru', 'nyepi', 'idul fitri', 'idul adha', 'wafat isa', 'kenaikan isa', 'imlek', 'isra mikraj', 'waisak', 'pancasila', 'kemerdekaan', 'maulid', 'natal']
    if (liburKeywords.some(k => n.includes(k))) return { label: 'Libur', color: 'bg-amber-100 text-amber-600 dark:bg-amber-900/40 dark:text-amber-300' }
    
    return { label: 'Peringatan', color: 'bg-blue-100 text-blue-600 dark:bg-blue-900/40 dark:text-blue-300' }
  }

  const all = [
    ...(Array.isArray(rerainan) ? rerainan.map((r: any) => ({ ...r, isRerainan: true })) : [])
  ].filter(e => e && typeof e.date === 'number' && e.date >= todayDate)
  
  all.sort((a, b) => a.date - b.date)
  
  const unique: any[] = []
  const seen = new Set()
  all.forEach(item => {
    const key = `${item.date}-${item.name}`
    if (!seen.has(key)) {
      const catInfo = getCat(item.name, item.isRerainan)
      unique.push({
        ...item,
        daysLeft: item.date - todayDate,
        cat: catInfo
      })
      seen.add(key)
    }
  })
  
  return unique
})
</script>
