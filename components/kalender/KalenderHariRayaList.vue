<template>
  <div class="card p-4">
    <h4 class="card-label mb-3">Hari Raya & Libur</h4>
    
    <div v-if="kalender.currentReligiousDays.value?.length === 0 && kalender.currentHolidays.value?.length === 0" class="text-sm text-muted italic">
      Tidak ada hari raya atau libur di bulan ini.
    </div>

    <div class="space-y-6">
      <!-- 1. Rerainan -->
      <div v-if="kalender.currentReligiousDays.value?.length > 0">
        <h5 class="flex items-center gap-2 text-[10px] font-bold text-red-600 dark:text-red-400 mb-3 uppercase tracking-widest">
          <Icon name="lucide:flame" class="w-3.5 h-3.5" />
          Rerainan (Hari Suci)
        </h5>
        <div class="space-y-2">
          <div v-for="(hari, i) in kalender.currentReligiousDays.value" :key="'r-'+i" class="flex items-start gap-3">
            <div class="w-8 h-8 rounded-xl bg-red-100 dark:bg-red-900/30 text-red-600 flex-shrink-0 flex items-center justify-center font-bold text-sm shadow-sm">
              {{ hari.date }}
            </div>
            <div class="pt-0.5">
              <p class="font-bold text-sm text-default leading-tight">{{ hari.name }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- 2. Libur Nasional -->
      <div v-if="kalender.categorizedHolidays.value.libur.length > 0">
        <h5 class="flex items-center gap-2 text-[10px] font-bold text-amber-600 dark:text-amber-400 mb-3 uppercase tracking-widest">
          <Icon name="lucide:calendar-days" class="w-3.5 h-3.5" />
          Hari Libur Nasional
        </h5>
        <div class="space-y-2">
          <div v-for="(libur, i) in kalender.categorizedHolidays.value.libur" :key="'h-l-'+i" class="flex items-start gap-3">
            <div class="w-8 h-8 rounded-xl bg-amber-100 dark:bg-amber-900/30 text-amber-600 flex-shrink-0 flex items-center justify-center font-bold text-sm shadow-sm">
              {{ libur.date }}
            </div>
            <div class="pt-0.5">
              <p class="font-bold text-sm text-default leading-tight">{{ libur.name }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- 3. Cuti Bersama -->
      <div v-if="kalender.categorizedHolidays.value.cuti.length > 0">
        <h5 class="flex items-center gap-2 text-[10px] font-bold text-teal-600 dark:text-teal-400 mb-3 uppercase tracking-widest">
          <Icon name="lucide:briefcase" class="w-3.5 h-3.5" />
          Cuti Bersama
        </h5>
        <div class="space-y-2">
          <div v-for="(cuti, i) in kalender.categorizedHolidays.value.cuti" :key="'h-c-'+i" class="flex items-start gap-3">
            <div class="w-8 h-8 rounded-xl bg-teal-100 dark:bg-teal-900/30 text-teal-600 flex-shrink-0 flex items-center justify-center font-bold text-sm shadow-sm">
              {{ cuti.date }}
            </div>
            <div class="pt-0.5">
              <p class="font-bold text-sm text-default leading-tight">{{ cuti.name }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- 4. Hari Peringatan -->
      <div v-if="kalender.categorizedHolidays.value.peringatan.length > 0">
        <h5 class="flex items-center gap-2 text-[10px] font-bold text-blue-600 dark:text-blue-400 mb-3 uppercase tracking-widest">
          <Icon name="lucide:award" class="w-3.5 h-3.5" />
          Hari Peringatan
        </h5>
        <div class="space-y-2">
          <div v-for="(hib, i) in kalender.categorizedHolidays.value.peringatan" :key="'h-p-'+i" class="flex items-start gap-3">
            <div class="w-8 h-8 rounded-xl bg-blue-100 dark:bg-blue-900/30 text-blue-600 flex-shrink-0 flex items-center justify-center font-bold text-sm shadow-sm">
              {{ hib.date }}
            </div>
            <div class="pt-0.5">
              <p class="font-bold text-sm text-default leading-tight">{{ hib.name }}</p>
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
