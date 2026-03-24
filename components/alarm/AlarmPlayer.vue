<script setup lang="ts">
import { useAlarmStore } from '~/stores/alarm.store'
import { useIntervalFn } from '@vueuse/core'

const alarmStore = useAlarmStore()
const { isPlaying, youtubeId } = storeToRefs(alarmStore)

// Check current time every minute
const checkAlarms = () => {
  const now = new Date()
  const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`
  
  const triggeredAlarm = alarmStore.alarms.find(a => a.isEnabled && a.time === currentTime && !alarmStore.isCompletedToday(a.id))
  
  if (triggeredAlarm && !alarmStore.isPlaying) {
    console.log(`⏰ Alarm triggered: ${triggeredAlarm.name} at ${currentTime}`)
    alarmStore.setPlaying(true, triggeredAlarm.id)
    
    // Auto stop after 5 minutes (300 seconds) if not manual
    setTimeout(() => {
      alarmStore.setPlaying(false, triggeredAlarm.id)
    }, 300000)
  }
}

// Start interval
useIntervalFn(checkAlarms, 30000) // check every 30s for better accuracy

const stopAudio = () => {
  alarmStore.setPlaying(false, alarmStore.activeAlarmId)
}
</script>

<template>
  <div v-if="isPlaying" class="fixed bottom-24 right-4 z-50 animate-bounce-subtle">
    <div class="bg-brand text-white p-3 rounded-2xl shadow-premium flex items-center gap-3 border border-white/20">
      <div class="w-8 h-8 flex items-center justify-center bg-white/20 rounded-full">
        <span class="animate-pulse">🔊</span>
      </div>
      <div class="mr-2">
        <p class="text-[10px] font-medium opacity-80 uppercase tracking-wider">Sedang Memutar</p>
        <p class="text-xs font-bold leading-none">Tri Sandhya Mantra</p>
      </div>
      <button @click="stopAudio" class="w-8 h-8 flex items-center justify-center hover:bg-white/10 rounded-full transition-colors">
        ✕
      </button>
      
      <!-- Hidden YouTube Iframe -->
      <iframe
        v-if="isPlaying"
        class="hidden"
        :src="`https://www.youtube.com/embed/${youtubeId}?autoplay=1&mute=0&enablejsapi=1`"
        allow="autoplay"
      ></iframe>
    </div>
  </div>
</template>

<style scoped>
.animate-bounce-subtle {
  animation: bounce-subtle 3s infinite ease-in-out;
}

@keyframes bounce-subtle {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-5px); }
}

.shadow-premium {
  box-shadow: 0 10px 30px -10px rgba(var(--brand-primary-rgb), 0.5);
}
</style>
