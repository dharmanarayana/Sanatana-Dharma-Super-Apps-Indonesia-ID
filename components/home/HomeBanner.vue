<template>
  <div class="relative overflow-hidden bg-gradient-to-br from-brand via-brand-secondary to-maroon/40 rounded-3xl p-6 text-white shadow-xl shadow-brand/10 border border-white/5 group active:scale-[0.98] transition-all">
    <!-- Background Pattern -->
    <div class="absolute -top-10 -right-10 opacity-10 rotate-12 select-none pointer-events-none">
      <Icon name="ic:round-om" class="text-[180px]" />
    </div>

    <div class="relative z-10 flex flex-col gap-1">
      <span class="text-[10px] font-sans tracking-[0.2em] uppercase text-white/80 font-bold">Warta Kalender</span>
      <h3 class="text-2xl font-serif font-bold text-white leading-tight drop-shadow-sm">
        <span v-if="kalender.isLoading.value" class="animate-pulse bg-white/20 h-8 rounded w-3/4 block"></span>
        <span v-else>{{ kalender.selectedDate.value }} {{ kalender.monthName.value }} {{ kalender.selectedYear.value }}</span>
      </h3>
      <div class="flex flex-wrap items-center gap-2 mt-4">
        <div class="bg-white px-3 py-1.5 rounded-lg shadow-sm text-[11px] font-bold text-brand uppercase tracking-wider">
          Saka {{ tahunSaka }}
        </div>
        <div class="bg-brand-secondary px-3 py-1.5 rounded-lg shadow-sm text-[11px] font-bold text-maroon uppercase tracking-wider">
          {{ bulanSaka }}
        </div>
        <div class="bg-black/20 backdrop-blur-sm px-3 py-1.5 rounded-lg border border-white/10 text-[11px] font-bold text-white uppercase tracking-wider">
          Wuku {{ wukuToday }}
        </div>
      </div>
    </div>
    
      <div class="flex items-center justify-between text-xs pt-3 border-t border-white/5">
        <button @click="detectLocation" class="flex items-center gap-1.5 font-bold text-white/90 hover:text-white transition-colors text-left outline-none" title="Deteksi Lokasi GPS Anda">
          <Icon v-if="isLocating" name="lucide:loader-2" class="w-4 h-4 animate-spin" />
          <Icon v-else name="lucide:map-pin" class="w-4 h-4" />
          <span class="truncate max-w-[150px] sm:max-w-[200px]">{{ currentLocation }}</span>
        </button>
      </div>

  </div>
</template>

<script setup>
import { computed, ref, onMounted } from 'vue'
import { useKalender } from '~/composables/useKalender'

const kalender = useKalender()

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
  // Auto-detect location immediately on mount
  detectLocation()
})

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


