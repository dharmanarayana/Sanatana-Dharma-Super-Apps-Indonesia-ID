<template>
  <Transition name="slide-down">
    <div v-if="!isOnline" class="offline-banner">
      <div class="content">
        <Icon name="tabler:wifi-off" class="icon" />
        <span>Koneksi terputus. Anda sedang dalam mode offline.</span>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { useNetwork } from '@vueuse/core'

const { isOnline } = useNetwork()
</script>

<style scoped>
.offline-banner {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 9999;
  background-color: var(--status-error-bg, #fee2e2);
  border-bottom: 1px solid var(--status-error-border, #fecaca);
  padding: 0.75rem 1rem;
  display: flex;
  justify-content: center;
  align-items: center;
}

.content {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--status-error-text, #991b1b);
  font-size: 0.875rem;
  font-weight: 500;
}

.icon {
  font-size: 1.25rem;
}

.slide-down-enter-active,
.slide-down-leave-active {
  transition: transform 0.3s ease;
}

.slide-down-enter-from,
.slide-down-leave-to {
  transform: translateY(-100%);
}
</style>
