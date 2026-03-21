<script setup lang="ts">
const colorMode = useColorMode()

// Cycle: light → dark → system → light
const modes = ['light', 'dark', 'system'] as const
type Mode = typeof modes[number]

const toggle = () => {
  const current = modes.indexOf(colorMode.preference as Mode)
  colorMode.preference = modes[(current + 1) % modes.length]
}

const icon = computed(() => {
  if (colorMode.preference === 'dark')   return 'moon'
  if (colorMode.preference === 'light')  return 'sun'
  return 'monitor'  // system
})

const label = computed(() => {
  if (colorMode.preference === 'dark')   return 'Mode Gelap'
  if (colorMode.preference === 'light')  return 'Mode Terang'
  return 'Ikuti Sistem'
})
</script>

<template>
  <button
    @click="toggle"
    :aria-label="`Ganti tema: ${label}`"
    class="relative flex items-center justify-center
           w-10 h-10 rounded-full
           transition-all duration-200
           hover:bg-[var(--state-hover)]
           active:scale-90"
  >
    <!-- Sun icon (light) -->
    <Transition name="theme-icon">
      <svg v-if="icon === 'sun'"
           key="sun"
           xmlns="http://www.w3.org/2000/svg"
           class="w-5 h-5 text-[var(--brand-primary)]"
           viewBox="0 0 24 24" fill="none"
           stroke="currentColor" stroke-width="2">
        <circle cx="12" cy="12" r="5"/>
        <line x1="12" y1="1"  x2="12" y2="3"/>
        <line x1="12" y1="21" x2="12" y2="23"/>
        <line x1="4.22" y1="4.22"   x2="5.64" y2="5.64"/>
        <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
        <line x1="1"  y1="12" x2="3"  y2="12"/>
        <line x1="21" y1="12" x2="23" y2="12"/>
        <line x1="4.22" y1="19.78"  x2="5.64" y2="18.36"/>
        <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
      </svg>
    </Transition>

    <!-- Moon icon (dark) -->
    <Transition name="theme-icon">
      <svg v-if="icon === 'moon'"
           key="moon"
           xmlns="http://www.w3.org/2000/svg"
           class="w-5 h-5 text-[var(--brand-secondary)]"
           viewBox="0 0 24 24" fill="none"
           stroke="currentColor" stroke-width="2">
        <path d="M21 12.79A9 9 0 1 1 11.21 3
                 a7 7 0 0 0 9.79 9.79z"/>
      </svg>
    </Transition>

    <!-- Monitor icon (system) -->
    <Transition name="theme-icon">
      <svg v-if="icon === 'monitor'"
           key="monitor"
           xmlns="http://www.w3.org/2000/svg"
           class="w-5 h-5 text-[var(--text-secondary)]"
           viewBox="0 0 24 24" fill="none"
           stroke="currentColor" stroke-width="2">
        <rect x="2" y="3" width="20" height="14" rx="2"/>
        <polyline points="8 21 12 17 16 21"/>
      </svg>
    </Transition>
  </button>
</template>

<style scoped>
.theme-icon-enter-active,
.theme-icon-leave-active {
  transition: opacity 150ms ease, transform 150ms ease;
  position: absolute;
}
.theme-icon-enter-from { opacity: 0; transform: rotate(-30deg) scale(0.7); }
.theme-icon-leave-to   { opacity: 0; transform: rotate(30deg)  scale(0.7); }
</style>
