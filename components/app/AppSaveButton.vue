<template>
  <ClientOnly>
    <button 
      @click.stop.prevent="handleToggle" 
      :disabled="isProcessing"
      class="group relative flex items-center justify-center transition-all active:scale-95"
      :class="[
        active ? 'text-brand' : 'text-muted/40 hover:text-brand/60',
        sizeClasses[size]
      ]"
      :aria-label="active ? 'Hapus dari simpanan' : 'Simpan ke favorit'"
    >
      <!-- Background Glow on Active -->
      <span v-if="active" class="absolute inset-0 bg-brand/10 rounded-full blur-md animate-pulse"></span>
      
      <!-- Icon -->
      <Icon 
        :name="active ? 'lucide:bookmark-check' : 'lucide:bookmark'" 
        class="relative transition-transform duration-300 group-hover:scale-110"
        :class="size === 'sm' ? 'w-4 h-4' : 'w-5 h-5'"
      />

      <!-- Tooltip -->
      <span class="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-charcoal text-white text-[10px] rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-10">
        {{ active ? 'Tersimpan' : 'Simpan' }}
      </span>
    </button>
  </ClientOnly>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useSavedItems } from '~/composables/useSavedItems'

const props = defineProps<{
  item: any
  type: 'video' | 'news' | 'prayer' | 'scripture'
  path: string
  size?: 'sm' | 'md'
}>()

const size = props.size || 'md'
const sizeClasses = {
  sm: 'w-8 h-8',
  md: 'w-10 h-10'
}

const authStore = useAuthStore()
const { isSaved, toggleSave } = useSavedItems()
const isProcessing = ref(false)

const active = computed(() => isSaved(props.item.$id || props.item.id))

const handleToggle = async () => {
  if (isProcessing.value) return
  
  if (!authStore.isLoggedIn) {
    alert('Silakan login terlebih dahulu untuk menyimpan konten ini.')
    // navigateTo('/login') // Optional: uncomment if direct redirect is desired
    return
  }

  isProcessing.value = true
  
  await toggleSave({
    id: props.item.$id || props.item.id,
    title: props.item.title,
    image: props.item.image || props.item.thumbnail,
    type: props.type,
    path: props.path
  })
  
  isProcessing.value = false
}
</script>
