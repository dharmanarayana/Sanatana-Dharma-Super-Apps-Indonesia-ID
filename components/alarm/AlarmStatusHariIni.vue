<script setup lang="ts">
import { useAlarmStore } from '~/stores/alarm.store'
const alarmStore = useAlarmStore()
</script>

<template>
  <div class="card p-5 bg-gradient-to-br from-brand/10 to-transparent border-brand/20 rounded-3xl">
    <h4 class="text-sm font-bold opacity-70 uppercase tracking-widest mb-4">Status Hari Ini</h4>
    <div class="flex gap-4">
      <div v-for="(alarm, idx) in alarmStore.alarms" :key="alarm.id" 
           :class="[
             'w-10 h-10 rounded-2xl flex items-center justify-center text-xs font-bold transition-all duration-500',
             alarm.isEnabled ? 'bg-brand text-white shadow-lg shadow-brand/20' : 'bg-gray-100 dark:bg-gray-800 text-gray-400'
           ]">
        <span v-if="alarm.isEnabled">✅</span>
        <span v-else>{{ idx + 1 }}</span>
      </div>
    </div>
    <p class="text-[10px] mt-4 text-muted italic">* Aktifkan alarm untuk menerima pengingat otomatis.</p>
  </div>
</template>
