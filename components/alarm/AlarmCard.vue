<script setup lang="ts">
import { useAlarmStore } from '~/stores/alarm.store'

const props = defineProps<{ 
  alarm: { id: string, name: string, time: string, isEnabled: boolean } 
}>()

const alarmStore = useAlarmStore()

const toggle = () => {
  alarmStore.toggleAlarm(props.alarm.id)
}
</script>

<template>
  <div class="card p-4 flex items-center justify-between transition-all hover:border-brand/40 group">
    <div class="flex items-center gap-4">
      <div class="w-12 h-12 rounded-2xl bg-brand/5 flex items-center justify-center text-2xl transition-transform group-hover:scale-110">
        {{ alarm.id === 'pagi' ? '🌅' : alarm.id === 'siang' ? '☀️' : '🌇' }}
      </div>
      <div>
        <h4 class="font-bold text-base">Tri Sandhya {{ alarm.name }}</h4>
        <div class="flex items-center gap-2">
           <p class="text-sm font-medium text-[var(--brand-primary)]">{{ alarm.time }} <span class="text-[10px] opacity-70">WITA</span></p>
           <span v-if="alarm.isEnabled" class="flex w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
        </div>
      </div>
    </div>

    <!-- Premium Toggle Switch -->
    <button 
      @click="toggle"
      :class="[
        'relative inline-flex h-7 w-12 items-center rounded-full transition-all duration-300 focus:outline-none ring-2 ring-transparent focus:ring-brand/20',
        alarm.isEnabled ? 'bg-brand shadow-[0_0_15px_-3px_rgba(var(--brand-primary-rgb),0.6)]' : 'bg-gray-200 dark:bg-gray-700'
      ]"
    >
      <span
        :class="[
          'inline-block h-5 w-5 transform rounded-full bg-white shadow-sm transition-transform duration-300 ease-in-out',
          alarm.isEnabled ? 'translate-x-6' : 'translate-x-1'
        ]"
      />
    </button>
  </div>
</template>

<style scoped>
.card {
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: 1.5rem;
}
</style>
