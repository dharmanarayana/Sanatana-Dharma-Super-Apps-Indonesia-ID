<template>
  <div class="card p-4 hover:border-brand/40 transition-colors group cursor-pointer h-full flex flex-col">
    <div class="aspect-video bg-brand/5 rounded-xl mb-3 overflow-hidden shrink-0 relative flex items-center justify-center">
      <img 
        v-if="temple.image" 
        :src="temple.image" 
        class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 absolute inset-0 z-10" 
        @error="(e: any) => e.target.style.display = 'none'"
      />
      <div class="flex flex-col items-center justify-center text-brand/30">
        <Icon name="fa6-solid:om" size="48" />
        <span class="text-[8px] font-black italic mt-1 uppercase tracking-widest opacity-50">Sanatana Dharma</span>
      </div>
    </div>
    <div class="flex-1 min-w-0">
      <div class="flex justify-between items-start mb-2">
        <h4 class="font-bold text-default text-base line-clamp-1">{{ temple.name }}</h4>
        <span class="text-xs font-bold text-brand bg-brand/10 px-2 py-0.5 rounded">PURA</span>
      </div>
      <p class="text-sm text-muted flex items-center justify-between mb-4">
        <span class="flex items-center gap-1 line-clamp-1">
          <Icon name="lucide:map-pin" size="12" />
          {{ temple.city ? `${temple.city}, ${temple.province}` : (temple.province || 'Indonesia') }}
        </span>
        <span v-if="formattedDistance" class="text-[10px] font-bold text-brand shrink-0 italic">
          {{ formattedDistance }}
        </span>
      </p>
    </div>
    <div class="flex gap-2 mt-auto">
      <NuxtLink :to="`/pura/${temple.slug}`" class="flex-1 btn-primary py-2.5 text-sm uppercase font-bold justify-center">
        Detail Pura
      </NuxtLink>
      <button 
        @click.stop="openInMaps"
        class="w-12 h-12 rounded-lg bg-surface-variant flex items-center justify-center hover:bg-brand/10 transition-colors text-xl"
        title="Buka di Google Maps"
      >
        <Icon name="lucide:map" size="20" class="text-secondary" />
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  temple: any
}>()

const formattedDistance = computed(() => {
  const d = props.temple.distance
  if (d === null || d === undefined) return null
  if (d < 1) {
    return `${Math.round(d * 1000)}m dari titik Anda`
  }
  return `${d.toFixed(1)}km dari titik Anda`
})

const openInMaps = () => {
  const { name, province, latitude, longitude } = props.temple
  const nameQuery = (name + ' ' + (province || '')).trim().replace(/\s+/g, '+')
  let url = `https://www.google.com/maps/search/${nameQuery}`
  
  if (latitude && longitude && Number(latitude) !== 0) {
    url += `/@${latitude},${longitude},17z`
  }
  
  window.open(url, '_blank')
}
</script>
