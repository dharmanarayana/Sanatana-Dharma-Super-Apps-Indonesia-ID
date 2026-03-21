<template>
  <div class="card p-4">
    <h4 class="card-label mb-3">Hari Raya & Libur</h4>
    
    <div v-if="kalender.currentReligiousDays.value?.length === 0 && kalender.currentHolidays.value?.length === 0" class="text-sm text-muted italic">
      Tidak ada hari raya atau libur di bulan ini.
    </div>

    <div class="space-y-4">
      <!-- Rerainan -->
      <div v-if="kalender.currentReligiousDays.value?.length > 0">
        <h5 class="text-xs font-bold text-red-600 dark:text-red-400 mb-2 uppercase tracking-wide">Rerainan (Hari Suci)</h5>
        <div class="space-y-2">
          <div v-for="(hari, i) in kalender.currentReligiousDays.value" :key="'r-'+i" class="flex items-start gap-3">
            <div class="w-8 h-8 rounded-lg bg-red-100 dark:bg-red-900/30 text-red-600 flex-shrink-0 flex items-center justify-center font-bold text-sm">
              {{ hari.date }}
            </div>
            <div class="pt-1">
              <p class="font-bold text-sm leading-tight">{{ hari.name }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Holidays -->
      <div v-if="kalender.currentHolidays.value?.length > 0">
        <h5 class="text-xs font-bold text-blue-600 dark:text-blue-400 mb-2 uppercase tracking-wide">Libur Nasional</h5>
        <div class="space-y-2">
          <div v-for="(libur, i) in kalender.currentHolidays.value" :key="'h-'+i" class="flex items-start gap-3">
            <div class="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/30 text-blue-600 flex-shrink-0 flex items-center justify-center font-bold text-sm">
              {{ libur.date }}
            </div>
            <div class="pt-1">
              <p class="font-bold text-sm leading-tight">{{ libur.name }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  kalender: {
    type: Object,
    required: true
  }
})
</script>
