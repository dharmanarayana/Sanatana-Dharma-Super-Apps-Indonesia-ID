<template>
  <div class="relative overflow-visible bg-gradient-to-r from-[var(--brand-primary)] to-[var(--brand-secondary)] rounded-2xl p-5 text-inverse shadow-lg">
    <!-- Background Pattern -->
    <div class="absolute -top-10 -right-10 text-9xl opacity-10 rotate-12 select-none pointer-events-none">
      🕉️
    </div>

    <div class="relative z-10 flex flex-col gap-1">
      <span class="text-xs font-sans tracking-[0.2em] uppercase text-inverse/80">Info Kalender Hari Ini</span>
      <h3 class="text-2xl font-serif font-bold drop-shadow-md text-inverse">
        <span v-if="kalender.isLoading.value" class="animate-pulse bg-white/20 h-8 rounded w-3/4 block"></span>
        <span v-else>{{ kalender.selectedDate.value }} {{ kalender.monthName.value }} {{ kalender.selectedYear.value }}</span>
      </h3>
      <div class="flex flex-wrap items-center gap-2 mt-2">
        <div class="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full border border-white/30 text-xs font-medium text-inverse">
          Tahun Saka {{ tahunSaka }}
        </div>
        <div class="bg-white/10 backdrop-blur-sm px-3 py-1 rounded-full border border-white/20 text-xs font-medium text-inverse capitalize">
          {{ bulanSaka }}
        </div>
        <div class="bg-white/10 backdrop-blur-sm px-3 py-1 rounded-full border border-white/20 text-xs font-medium text-inverse">
          Wuku {{ wukuToday }}
        </div>
      </div>
    </div>
    
    <div class="mt-4 pt-4 border-t border-white/10 flex items-center justify-between text-xs text-inverse/90">
      <button @click="detectLocation" class="flex items-center gap-1.5 font-bold opacity-80 hover:opacity-100 transition-opacity text-left outline-none" title="Deteksi Lokasi GPS Anda">
        <Icon v-if="isLocating" name="lucide:loader-2" class="w-4 h-4 animate-spin" />
        <Icon v-else name="lucide:map-pin" class="w-4 h-4" />
        <span class="truncate max-w-[150px] sm:max-w-[200px]">{{ currentLocation }}</span>
      </button>
      
      <!-- Dewasa Ayu Dropdown Native -->
      <div class="relative">
        <button 
          @click.stop="toggleDewasaDialog"
          class="flex items-center gap-1.5 font-serif italic font-bold hover:text-yellow-300 transition-colors z-20 relative cursor-pointer outline-none bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/20"
        >
          <span>Dewasa Ayu (Ala Ayuning Dewasa)</span>
          <Icon name="lucide:chevron-down" :class="['w-4 h-4 transition-transform', isDewasaOpen ? 'rotate-180': '']" />
        </button>
        
        <!-- The Floating Panel -->
        <transition 
          enter-active-class="transition duration-200 ease-out" 
          enter-from-class="translate-y-1 opacity-0" 
          enter-to-class="translate-y-0 opacity-100" 
          leave-active-class="transition duration-150 ease-in" 
          leave-from-class="translate-y-0 opacity-100" 
          leave-to-class="translate-y-1 opacity-0"
        >
          <div v-show="isDewasaOpen" class="absolute right-0 mt-2 w-[calc(100vw-40px)] max-w-sm sm:max-w-md bg-surface text-default shadow-xl rounded-xl border border-default p-4 z-50 max-h-[60vh] overflow-y-auto">
            <h4 class="font-bold border-b border-default pb-2 mb-3 sticky top-0 bg-surface/90 backdrop-blur-sm z-10 flex justify-between items-center">
              <span>Dewasa Ayu Hari Ini</span>
              <button @click="isDewasaOpen = false" class="p-1 hover:bg-default rounded text-muted">
                <Icon name="lucide:x" class="w-4 h-4" />
              </button>
            </h4>
            
            <div v-if="pendingDewasa" class="text-center py-6 text-muted">
              <Icon name="lucide:loader-2" class="w-6 h-6 animate-spin mx-auto mb-2" />
              <p class="text-sm">Memuat dari Kalender Bali...</p>
            </div>
            
            <div v-else-if="dewasaError || dewasaData?.items?.length === 0" class="text-center py-4 text-sm text-yellow-600">
              <Icon name="lucide:alert-circle" class="w-5 h-5 mx-auto mb-1 opacity-50" />
              Tidak ada data spesifik untuk hari ini, atau koneksi gagal.
            </div>
            
            <div v-else class="space-y-4">
              <div v-for="(item, i) in dewasaData?.items" :key="i" class="text-left text-sm">
                <p class="font-bold text-brand">{{ item.name }}</p>
                <p class="text-muted leading-relaxed mt-0.5">{{ item.description }}</p>
              </div>
            </div>
          </div>
        </transition>
      </div><!-- End Dewasa Dropdown -->

    </div>
  </div>
</template>

<script setup>
import { computed, ref, onMounted, onUnmounted } from 'vue'
import { useKalender } from '~/composables/useKalender'

const kalender = useKalender()

// Dropdown State
const isDewasaOpen = ref(false)
const toggleDewasaDialog = () => { isDewasaOpen.value = !isDewasaOpen.value }

// Click outside to close (simple implementation)
const closeOnOutside = (e) => {
  if (isDewasaOpen.value) isDewasaOpen.value = false
}

// -----------------------------------------------------------------
// GPS LOCATION LOGIC
// -----------------------------------------------------------------
const isLocating = ref(false)
const currentLocation = ref('Deteksi Lokasi...')

const detectLocation = () => {
  if (!navigator.geolocation) {
    currentLocation.value = 'GPS Tidak Didukung'
    return
  }

  isLocating.value = true
  
  navigator.geolocation.getCurrentPosition(
    async (position) => {
      try {
        const { latitude, longitude } = position.coords
        // Reverse Geocoding via free OpenStreetMap Nominatim
        const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=10`)
        const data = await response.json()
        
        if (data && data.address) {
          const city = data.address.city || data.address.county || data.address.town || data.address.region
          const state = data.address.state || ''
          
          if (city) {
            currentLocation.value = `${city}${state ? ', ' + state : ''}`
          } else {
            currentLocation.value = 'Lokasi Ditemukan'
          }
        }
      } catch (err) {
        console.error('Failed to reverse geocode:', err)
        currentLocation.value = 'Gagal Memuat Kota'
      } finally {
        isLocating.value = false
      }
    },
    (error) => {
      isLocating.value = false
      currentLocation.value = 'Kalender Bali' // Fallback
      if (error.code === error.PERMISSION_DENIED) {
        alert('Mohon izinkan akses lokasi (GPS) pada browser Anda agar kami bisa menyesuaikan kalender dengan wilayah Anda.')
      }
    },
    { enableHighAccuracy: false, timeout: 10000, maximumAge: 60000 }
  )
}

onMounted(() => {
  document.addEventListener('click', closeOnOutside)
  // Auto-detect location immediately on mount
  detectLocation()
})

onUnmounted(() => {
  document.removeEventListener('click', closeOnOutside)
})

// Fetch Dewasa Ayu dynamically (lazy)
const dateStr = computed(() => {
  return `?tanggal=${kalender.selectedDate.value}&bulan=${kalender.selectedMonth.value}&tahun=${kalender.selectedYear.value}`
})
const { data: dewasaData, pending: pendingDewasa, error: dewasaError } = useFetch(() => `/api/dewasa${dateStr.value}`, { lazy: true, server: false })


const { getMasehiToSaka } = useKalenderSaka()
const today = new Date()
const { tahunSaka } = getMasehiToSaka(today)

const sakaInfo = computed(() => kalender.selectedDayInfo.value?.sakaInfo || 'Tidak Ada Info')

const wukuToday = computed(() => {
  const parts = sakaInfo.value.split(',')[0].trim().split(' ')
  return parts.length > 2 ? parts[parts.length - 1] : parts.pop() || '-'
})

const bulanSaka = computed(() => {
  const info = sakaInfo.value.toLowerCase()
  if (info.includes('kepitu')) return 'Kepitu'
  if (info.includes('kawalu')) return 'Kawalu'
  if (info.includes('kasanga')) return 'Kasanga'
  if (info.includes('kedasa')) return 'Kedasa'
  if (info.includes('jyestha')) return 'Jyestha'
  return 'Sasih Berjalan'
})
</script>

<style scoped>
/* Let UI spill properly from parent if it has hidden overflow */
.overflow-visible {
  overflow: visible !important;
}
</style>
