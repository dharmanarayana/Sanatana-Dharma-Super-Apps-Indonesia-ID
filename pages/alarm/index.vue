<template>
  <div>
    <UiPageHeader icon="⏰" title="Alarm Tri Sandhya"
                  subtitle="Pengingat sembahyang 3 kali sehari"
                  back-path="/" />
    <div class="px-4 lg:px-0 py-4">
      <div class="grid lg:grid-cols-2 gap-6">
        <div class="space-y-4">
          <AlarmCard waktu="Pagi" />
          <AlarmCard waktu="Siang" />
          <AlarmCard waktu="Sore" />
        </div>
        <aside class="space-y-4">
          <StreakDisplay />
          <AlarmStatusHariIni />
          <AlarmPilihanSuara />
        </aside>
      </div>
    </div>
  </div>
</template>

<script setup>
// Logic alarm handled here
</script>
