<template>
  <div class="card p-4 bg-elevated border-brand-secondary">
    <div class="flex items-center gap-2 mb-4">
      <Icon name="lucide:calendar-range" class="w-6 h-6 text-brand-secondary" />
      <h4 class="font-bold text-default text-base font-serif">Dewasa Ayu Hari Ini</h4>
    </div>
    
    <div class="mt-2 pl-8 border-l-2 border-brand-secondary/10">
      <!-- Skeleton Loading -->
      <div v-if="pendingDewasa && !(dewasaData?.items?.length)" class="space-y-2 opacity-60">
        <div class="h-4 bg-brand/20 rounded w-full animate-pulse"></div>
        <div class="h-4 bg-brand/20 rounded w-3/4 animate-pulse"></div>
      </div>

      <!-- Content Section -->
      <!-- Content Section: Slideshow Mode -->
      <div v-else-if="dewasaData?.items?.length" class="min-h-[60px] flex items-center">
        <div class="w-full">
          <Transition name="slide-fade" mode="out-in">
            <div :key="currentSlideIndex" class="flex items-start gap-3">
              <!-- Animated Indicator -->
              <div class="mt-1.5 flex flex-col items-center">
                <span class="w-2 h-2 rounded-full bg-brand animate-pulse shrink-0"></span>
                <div v-if="!isTyping" class="w-px h-6 bg-gradient-to-b from-brand/20 to-transparent mt-1"></div>
              </div>

              <div class="flex flex-col min-w-0 flex-1">
                <h5 class="text-secondary font-bold text-sm leading-tight transition-colors">
                  {{ currentTypedName }}<span v-if="isTyping" class="inline-block w-0.5 h-3.5 bg-brand ml-1 animate-pulse"></span>
                </h5>
                <Transition name="fade">
                  <p v-if="!isTyping && dewasaData.items[currentSlideIndex]?.description" 
                     class="text-xs text-muted/80 leading-relaxed mt-1 line-clamp-2">
                    {{ sanitizeDescription(dewasaData.items[currentSlideIndex].description) }}
                  </p>
                </Transition>
              </div>
            </div>
          </Transition>
        </div>
      </div>
      
      <!-- Empty State -->
      <div v-else-if="!pendingDewasa" class="text-xs text-muted italic h-12 flex items-center">
        Tidak ada data dewasa ayu untuk hari ini.
      </div>
    </div>

    <!-- Navigation Dots -->
    <div v-if="Array.isArray(dewasaData?.items) && dewasaData.items.length > 1" class="flex justify-center gap-1 mt-4">
      <div v-for="(_, i) in dewasaData.items" :key="i" 
           :class="['h-1 rounded-full transition-all duration-300', i === currentSlideIndex ? 'w-4 bg-brand' : 'w-1 bg-brand/20']">
      </div>
    </div>
    
    <div class="mt-4 pl-8">
      <NuxtLink to="/ala-ayuning-dewasa" class="inline-flex items-center gap-1.5 text-[11px] font-bold text-brand-secondary hover:text-brand transition-colors py-1 px-2 bg-brand-secondary/5 rounded-md border border-brand-secondary/10 group">
        <span>Lihat Penjelasan Lengkap</span>
        <Icon name="lucide:chevron-right" class="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
      </NuxtLink>
    </div>
  </div>
</template>

<style scoped>
.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: all 0.4s ease;
}
.slide-fade-enter-from {
  transform: translateY(10px);
  opacity: 0;
}
.slide-fade-leave-to {
  transform: translateY(-10px);
  opacity: 0;
}

.fade-enter-active {
  transition: opacity 0.5s ease;
}
.fade-enter-from {
  opacity: 0;
}
</style>

<script setup>
import { ref, computed, watch, onUnmounted, onMounted } from 'vue'
import dayjs from 'dayjs'
import { useKalender } from '~/composables/useKalender'

function sanitizeDescription(text) {
  if (!text) return ''
  let cleaned = text.trim()
    .replace(/^[:,\s]+/, '')
    .replace(/\s*:\s*/g, ': ')
    .replace(/\s*,\s*/g, ', ')
  
  if (cleaned.length > 0) {
    cleaned = cleaned.charAt(0).toUpperCase() + cleaned.slice(1)
  }
  return cleaned
}

const kalender = useKalender()
const currentSlideIndex = ref(0)
const currentTypedName = ref('')
const isTyping = ref(false)
let typingInterval = null
let slideTimeout = null

const today = dayjs()
const dateStr = computed(() => {
  return `?tanggal=${today.date()}&bulan=${today.month() + 1}&tahun=${today.year()}`
})

const { data: dewasaData, pending: pendingDewasa } = useFetch(
  () => `/api/dewasa${dateStr.value}`, 
  { 
    key: `dewasa-today-slideshow-${today.format('YYYY-MM-DD')}`,
    lazy: true
  }
)

const startSlideShow = async () => {
  if (!dewasaData.value?.items?.length) return
  
  const items = dewasaData.value.items
  const item = items[currentSlideIndex.value]
  if (!item?.name) return

  // Start Typing
  currentTypedName.value = ''
  isTyping.value = true
  if (typingInterval) clearInterval(typingInterval)

  let charIdx = 0
  typingInterval = setInterval(() => {
    if (charIdx < (item?.name?.length || 0)) {
      currentTypedName.value += item.name[charIdx]
      charIdx++
    } else {
      clearInterval(typingInterval)
      isTyping.value = false
      
      // Wait then next slide
      slideTimeout = setTimeout(() => {
        currentSlideIndex.value = (currentSlideIndex.value + 1) % (items?.length || 1)
        startSlideShow()
      }, 3000) // Stay visible for 3s
    }
  }, 40)
}

watch(dewasaData, (newData) => {
  if (newData?.items?.length) {
    currentSlideIndex.value = 0
    startSlideShow()
  }
}, { immediate: true })


onMounted(() => {
  if (dewasaData.value?.items?.length) {
    startSlideShow()
  }
})

onUnmounted(() => {
  if (typingInterval) clearInterval(typingInterval)
  if (slideTimeout) clearTimeout(slideTimeout)
})

const sakaInfoShort = computed(() => {
  const info = kalender.selectedDayInfo.value?.sakaInfo
  if (!info) return '-'
  return info
})
</script>
