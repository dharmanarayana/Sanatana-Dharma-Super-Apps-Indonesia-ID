<template>
  <div>
    <UiPageHeader icon="🗓️" title="Kalender Hindu Saka"
                  subtitle="Wuku, hari raya, dan dewasa ayu"
                  back-path="/" />

    <div class="px-4 lg:px-0 py-4 max-w-7xl mx-auto">
      <!-- Kalender Header Navigation -->
      <div class="flex items-center justify-between bg-surface rounded-xl shadow-sm border border-default p-4 mb-4">
        <button @click="kalender.prevMonth" class="p-2 hover:bg-default rounded-lg transition-colors">
          <Icon name="lucide:chevron-left" class="w-5 h-5" />
        </button>
        <div class="flex items-center gap-3">
          <h3 class="text-xl font-bold flex items-center gap-2">
            {{ kalender.monthName }} {{ kalender.selectedYear }}
            <Icon v-if="kalender.isLoading.value" name="lucide:loader-2" class="w-4 h-4 animate-spin text-primary" />
          </h3>
        </div>
        <button @click="kalender.nextMonth" class="p-2 hover:bg-default rounded-lg transition-colors">
          <Icon name="lucide:chevron-right" class="w-5 h-5" />
        </button>
      </div>

      <!-- MOBILE: Kalender full-width, list hari raya di bawah -->
      <div class="lg:hidden space-y-4">
        <KalenderGrid :kalender="kalender" />
        <KalenderWukuInfo :kalender="kalender" />
        <KalenderHariRayaList :kalender="kalender" />
      </div>

      <!-- DESKTOP: Kalender di kiri, detail di kanan -->
      <div class="hidden lg:grid lg:grid-cols-[1fr_320px] gap-6">
        <KalenderGrid :kalender="kalender" />
        <aside class="space-y-4">
          <KalenderWukuInfo :kalender="kalender" />
          <KalenderHariRayaList :kalender="kalender" />
        </aside>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useKalender } from '~/composables/useKalender'

const kalender = useKalender()
</script>
