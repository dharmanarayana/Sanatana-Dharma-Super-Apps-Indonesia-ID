<template>
  <div class="bg-surface rounded-xl shadow-sm border border-default overflow-hidden p-4">
    <!-- Days of week headers -->
    <div class="grid grid-cols-7 border-b border-default pb-2 mb-2">
      <div v-for="day in ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab']" :key="day" class="text-center text-xs font-bold text-muted">
        {{ day }}
      </div>
    </div>
    
    <!-- Calendar Grid -->
    <div class="grid grid-cols-7 gap-1 flex-1">
      <div 
        v-for="(day, i) in kalender.gridDays.value" 
        :key="i"
        @click="day.isCurrentMonth ? kalender.selectDate(day.date) : null"
        :class="[
          'min-h-[80px] sm:min-h-[100px] lg:min-h-[120px] flex flex-col items-center justify-center rounded-lg text-sm md:text-base lg:text-lg relative transition-all',
          day.isCurrentMonth ? 'cursor-pointer hover:bg-default' : 'opacity-30',
          day.date === kalender.selectedDate.value && day.isCurrentMonth ? 'bg-primary text-primary-foreground font-bold shadow-md' : '',
          (i % 7 === 0) && day.date !== kalender.selectedDate.value && day.isCurrentMonth ? 'text-red-500' : ''
        ]"
      >
        <span v-if="day.date">
          {{ day.date }}
        </span>
        
        <!-- Indicators -->
        <div v-if="day.date && day.isCurrentMonth" class="absolute bottom-1 flex gap-1">
          <div v-if="day.hasRerainan" class="w-1.5 h-1.5 rounded-full bg-red-500"></div>
          <div v-if="day.hasHoliday" class="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
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
