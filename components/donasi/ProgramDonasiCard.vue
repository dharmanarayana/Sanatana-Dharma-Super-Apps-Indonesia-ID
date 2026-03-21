<template>
  <div class="card overflow-hidden group cursor-pointer hover:border-brand/30 transition-all flex flex-col h-full">
    <div class="h-40 bg-surface-variant overflow-hidden relative">
      <img v-if="program.image" :src="program.image" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
      <div v-else class="w-full h-full flex items-center justify-center opacity-20">
        <Icon name="lucide:heart" size="48" />
      </div>
      <div class="absolute top-3 left-3 px-2 py-1 bg-brand text-[10px] font-bold text-white rounded shadow-lg uppercase">
        {{ program.category }}
      </div>
    </div>
    <div class="p-4 flex-1 flex flex-col">
      <h4 class="font-bold text-default text-sm mb-4 line-clamp-2 leading-tight group-hover:text-brand transition-colors">
        {{ program.title }}
      </h4>
      
      <div class="mt-auto space-y-3">
        <div class="w-full h-2 bg-surface-variant rounded-full overflow-hidden">
          <div :style="{ width: `${progress}%` }" class="h-full bg-brand transition-all duration-1000"></div>
        </div>
        
        <div class="flex justify-between items-end">
          <div class="space-y-1">
            <p class="text-[10px] text-muted uppercase font-bold tracking-wider">Terkumpul</p>
            <p class="text-xs font-black italic text-brand">Rp {{ program.collected.toLocaleString('id-ID') }}</p>
          </div>
          <div class="text-right">
            <p class="text-[10px] font-black italic text-secondary">{{ progress }}%</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  program: any
}>()

const progress = computed(() => {
  const p = (props.program.collected / props.program.target) * 100
  return Math.min(Math.round(p), 100)
})
</script>
