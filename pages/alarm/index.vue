<script setup lang="ts">
definePageMeta({
  middleware: 'auth'
})

const alarmStore = useAlarmStore()
</script>

<template>
  <div>
    <UiPageHeader icon="⏰" title="Alarm Tri Sandhya"
                  subtitle="Pengingat sembahyang 3 kali sehari"
                  back-path="/" />
    
    <!-- Audio Player (Hidden) -->
    <AlarmPlayer />

    <div class="px-4 lg:px-0 py-4">
      <div class="grid lg:grid-cols-2 gap-6">
        <div class="space-y-4">
          <AlarmCard 
            v-for="alarm in alarmStore.alarms" 
            :key="alarm.id" 
            :alarm="alarm" 
          />
        </div>
        <aside class="space-y-4">
          <StreakDisplay />
          <AlarmStatusHariIni />
          <!-- sound picker removed as it's fixed to YouTube -->
        </aside>
      </div>
    </div>
  </div>
</template>
