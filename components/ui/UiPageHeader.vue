<!-- components/ui/UiPageHeader.vue -->
<script setup lang="ts">
defineProps<{
  title: string
  subtitle?: string
  icon?: string
  backPath?: string   // mobile: tombol back; desktop: diabaikan (pakai breadcrumb)
}>()
const { isDesktop } = useDevice()
</script>

<template>
  <!-- Mobile: compact header dengan tombol back -->
  <div v-if="!isDesktop"
       class="flex items-center gap-3 px-4 py-3 bg-surface
              border-b border-default sticky top-[60px] z-30 overflow-hidden">
    <span v-if="icon" class="text-2xl shrink-0">{{ icon }}</span>
    <div class="min-w-0">
      <h1 class="font-bold text-default text-lg leading-tight truncate">{{ title }}</h1>
      <p v-if="subtitle" class="text-muted text-xs truncate">{{ subtitle }}</p>
    </div>
  </div>

  <!-- Desktop: heading lebih besar dengan deskripsi -->
  <div v-else class="mb-8">
    <div class="flex items-center gap-4">
      <span v-if="icon" class="text-4xl">{{ icon }}</span>
      <div>
        <h1 class="page-title">{{ title }}</h1>
        <p v-if="subtitle" class="body-text mt-1">{{ subtitle }}</p>
      </div>
    </div>
    <div class="divider mt-6" />
  </div>
</template>
