<script setup lang="ts">
const colorMode = useColorMode()

const options = [
  { value: 'light',  label: 'Terang',  emoji: '☀️',  desc: 'Selalu terang' },
  { value: 'dark',   label: 'Gelap',   emoji: '🌙',  desc: 'Selalu gelap' },
  { value: 'system', label: 'Sistem',  emoji: '🖥️',  desc: 'Ikuti perangkat' },
]
</script>

<template>
  <div class="space-y-2">
    <p class="text-sm font-semibold text-secondary px-1 mb-3">Tema Tampilan</p>
    <div
      v-for="opt in options"
      :key="opt.value"
      @click="colorMode.preference = opt.value"
      class="flex items-center gap-3 p-3 rounded-xl cursor-pointer
             border transition-all duration-200"
      :class="colorMode.preference === opt.value
        ? 'border-[var(--border-brand)] bg-[var(--state-active)]'
        : 'border-[var(--border-default)] bg-[var(--bg-surface)] hover:bg-[var(--state-hover)]'"
    >
      <span class="text-xl w-8 text-center">{{ opt.emoji }}</span>
      <div class="flex-1">
        <p class="text-sm font-medium text-default">{{ opt.label }}</p>
        <p class="text-xs text-muted">{{ opt.desc }}</p>
      </div>
      <!-- Radio indicator -->
      <div class="w-5 h-5 rounded-full border-2 flex items-center justify-center
                  transition-colors duration-200"
           :class="colorMode.preference === opt.value
             ? 'border-[var(--brand-primary)]'
             : 'border-[var(--border-strong)]'"
      >
        <div v-if="colorMode.preference === opt.value"
             class="w-2.5 h-2.5 rounded-full bg-[var(--brand-primary)]" />
      </div>
    </div>
  </div>
</template>
