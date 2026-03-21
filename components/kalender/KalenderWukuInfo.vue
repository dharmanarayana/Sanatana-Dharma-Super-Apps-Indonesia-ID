<template>
  <div class="card p-4 bg-yellow-50 dark:bg-yellow-900/10 border-yellow-200 dark:border-yellow-800/30">
    <div v-if="kalender.selectedDayInfo.value" class="space-y-2">
      <h4 class="card-label text-yellow-800 dark:text-yellow-500 flex items-center gap-2">
        <Icon name="lucide:info" class="w-4 h-4" />
        Detail Saka
      </h4>
      <div class="text-xl font-bold">
        {{ kalender.selectedDate.value }} {{ kalender.monthName.value }} {{ kalender.selectedYear.value }}
      </div>
      <p class="body-text text-sm font-medium leading-relaxed">
        {{ kalender.selectedDayInfo.value.sakaInfo || 'Tidak ada info Saka' }}
      </p>
      
      <!-- Event for selected day -->
      <div v-if="selectedDayEvents.length > 0" class="pt-2 mt-2 border-t border-yellow-200/50 dark:border-yellow-800/50">
        <div v-for="(event, i) in selectedDayEvents" :key="i" class="text-sm font-bold text-red-600 dark:text-red-400">
          • {{ event.name }}
        </div>
      </div>
    </div>
    <div v-else class="text-center py-4 text-muted text-sm italic">
      Pilih tanggal pada kalender untuk melihat detail wuku dan pewarigaan.
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  kalender: {
    type: Object,
    required: true
  }
})

const selectedDayEvents = computed(() => {
  if (!props.kalender.selectedDayInfo.value) return []
  
  const dateStr = props.kalender.selectedDate.value
  const rerainan = props.kalender.currentReligiousDays.value?.filter(r => parseInt(r.date) === dateStr) || []
  const holidays = props.kalender.currentHolidays.value?.filter(h => parseInt(h.date) === dateStr) || []
  
  return [...rerainan, ...holidays]
})
</script>
