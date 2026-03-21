<script setup lang="ts">
const colorMode = useColorMode()
const isDark = computed({
  get: () => colorMode.preference === 'dark',
  set: (val) => { colorMode.preference = val ? 'dark' : 'light' }
})
</script>

<template>
  <div class="flex items-center justify-between py-3 px-4 card">
    <!-- Label -->
    <div class="flex items-center gap-3">
      <div class="w-9 h-9 rounded-full bg-[var(--state-active)]
                  flex items-center justify-center">
        <span class="text-lg">{{ isDark ? '🌙' : '☀️' }}</span>
      </div>
      <div>
        <p class="font-medium text-default text-sm">Mode Tampilan</p>
        <p class="text-muted text-xs mt-0.5">
          {{ isDark ? 'Mode Gelap aktif' : 'Mode Terang aktif' }}
        </p>
      </div>
    </div>

    <!-- Toggle switch -->
    <button
      @click="isDark = !isDark"
      :aria-label="isDark ? 'Aktifkan mode terang' : 'Aktifkan mode gelap'"
      class="relative w-12 h-6 rounded-full transition-colors duration-300
             focus:outline-none focus:ring-2 focus:ring-[var(--border-brand)]
             focus:ring-offset-2 focus:ring-offset-[var(--bg-surface)]"
      :class="isDark ? 'bg-[var(--brand-primary)]' : 'bg-[var(--border-strong)]'"
    >
      <span
        class="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full
               shadow-md transition-transform duration-300"
        :class="isDark ? 'translate-x-6' : 'translate-x-0'"
      />
    </button>
  </div>
</template>
