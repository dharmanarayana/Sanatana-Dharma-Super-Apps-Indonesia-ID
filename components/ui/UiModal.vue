<!-- components/ui/UiModal.vue -->
<script setup lang="ts">
defineProps<{ show: boolean; title?: string; maxWidth?: string }>()
defineEmits(['close'])
const { isDesktop } = useDevice()
</script>

<template>
  <Teleport to="body">
    <Transition :name="isDesktop ? 'modal-center' : 'modal-bottom'">
      <div v-if="show"
           class="fixed inset-0 z-50 flex"
           :class="isDesktop
             ? 'items-center justify-center p-4'
             : 'items-end justify-center'">

        <!-- Backdrop -->
        <div class="absolute inset-0 bg-overlay"
             @click="$emit('close')" />

        <!-- Panel modal -->
        <div class="relative z-10 bg-surface w-full"
             :class="[
               isDesktop
                 ? 'rounded-2xl shadow-lg max-h-[90vh] overflow-y-auto'
                 : 'rounded-t-2xl max-h-[90vh] overflow-y-auto',
               maxWidth || (isDesktop ? 'max-w-lg' : 'max-w-full')
             ]">

          <!-- Handle bar mobile -->
          <div v-if="!isDesktop"
               class="w-10 h-1 bg-border-strong rounded-full mx-auto mt-3 mb-1" />

          <!-- Header modal -->
          <div v-if="title || $slots.header"
               class="flex items-center justify-between px-5 py-4
                      border-b border-default">
            <h3 class="font-bold text-default text-lg">{{ title }}</h3>
            <button @click="$emit('close')"
                    class="touch-target rounded-full text-muted hover:text-default"
                    aria-label="Tutup">
              ✕
            </button>
          </div>

          <!-- Konten -->
          <div class="p-5">
            <slot />
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
/* Desktop: muncul dari tengah (fade + scale) */
.modal-center-enter-active,
.modal-center-leave-active { transition: opacity 200ms ease, transform 200ms ease; }
.modal-center-enter-from   { opacity: 0; transform: scale(0.95); }
.modal-center-leave-to     { opacity: 0; transform: scale(0.95); }

/* Mobile: slide dari bawah */
.modal-bottom-enter-active,
.modal-bottom-leave-active { transition: opacity 250ms ease, transform 250ms ease; }
.modal-bottom-enter-from   { opacity: 0; transform: translateY(100%); }
.modal-bottom-leave-to     { opacity: 0; transform: translateY(100%); }
</style>
