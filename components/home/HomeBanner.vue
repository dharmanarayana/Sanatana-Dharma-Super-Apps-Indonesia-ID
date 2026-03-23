<template>
  <div class="relative overflow-hidden bg-gradient-to-br from-brand via-brand-secondary to-maroon/40 rounded-3xl p-6 text-white shadow-xl shadow-brand/10 border border-white/5 group active:scale-[0.98] transition-all">
    <ClientOnly>
      <div class="absolute -top-10 -right-10 opacity-10 rotate-12 select-none pointer-events-none">
        <Icon name="fa6-solid:om" class="text-[180px]" />
      </div>
    </ClientOnly>

    <div class="relative z-10 flex flex-col gap-1">
      <span class="text-xs font-sans tracking-[0.2em] uppercase text-white font-bold opacity-90">
        Info Saka Hari {{ currentDayName }}
      </span>
      <h3 class="text-2xl font-serif font-bold text-white leading-tight drop-shadow-sm">
        <span v-if="kalender.isLoading" class="animate-pulse bg-white/20 h-8 rounded w-3/4 block"></span>
        <span v-else>{{ sakaInfo }}</span>
      </h3>
      <div class="flex flex-wrap items-center gap-2 mt-4">
        <div class="bg-white px-3 py-1.5 rounded-lg shadow-sm text-sm font-bold text-brand uppercase tracking-wider">
          Saka {{ tahunSaka }}
        </div>
        <div class="bg-brand-secondary px-3 py-1.5 rounded-lg shadow-sm text-sm font-bold text-maroon uppercase tracking-wider">
          {{ bulanSaka }}
        </div>
        <div class="bg-black/20 backdrop-blur-sm px-3 py-1.5 rounded-lg border border-white/10 text-sm font-bold text-white uppercase tracking-wider">
          Wuku {{ wukuToday }}
        </div>
      </div>

      <div class="flex items-center justify-between text-sm pt-3 border-t border-white/5 mt-4">
        <button @click="detectLocation(true)" class="flex items-center gap-1.5 font-bold text-white/90 hover:text-white transition-colors text-left outline-none" title="Deteksi Lokasi GPS Anda">
          <Icon v-if="isLocating" name="lucide:loader-2" class="w-4 h-4 animate-spin" />
          <Icon v-else name="lucide:map-pin" class="w-4 h-4" />
          <span class="truncate max-w-[150px] sm:max-w-[200px]">{{ currentLocation }}</span>
        </button>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { computed, ref, onMounted } from 'vue'
import { useKalender } from '~/composables/useKalender'
import dayjs from 'dayjs'

const kalender = useKalender()
const currentDayName = computed(() => dayjs().format('dddd'))

// -----------------------------------------------------------------
// GPS LOCATION LOGIC
// -----------------------------------------------------------------
const isLocating = ref(false)
const currentLocation = ref('Deteksi Lokasi...')

const detectLocation = (force = false) => {
  // Check cache first if not forced
  if (!force) {
    const cached = localStorage.getItem('sdd_last_location')
    if (cached) {
      currentLocation.value = cached
      return
    }
  }

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
            const result = `${city}${state ? ', ' + state : ''}`
            currentLocation.value = result
            localStorage.setItem('sdd_last_location', result)
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
      currentLocation.value = 'Lokasi Tidak Terdeteksi' // Fallback
      if (error.code === error.PERMISSION_DENIED) {
        // Only alert if forced by user action
        if (force) {
          alert('Mohon izinkan akses lokasi (GPS) pada browser Anda agar kami bisa menyesuaikan kalender dengan wilayah Anda.')
        }
      }
    },
    { enableHighAccuracy: false, timeout: 10000, maximumAge: 3600000 } // Cache for 1 hour at browser level
  )
}

onMounted(() => {
  // Try to detect location, but favor cache
  setTimeout(() => {
    detectLocation(false)
  }, 1000)
})

const { getMasehiToSaka } = useKalenderSaka()

const today = new Date()
const { tahunSaka } = getMasehiToSaka(today)

const WUKU_LIST = [
  'Sinta', 'Landep', 'Ukir', 'Kulantir', 'Tolu', 'Gumbreg', 'Wariga', 'Warigadean', 'Julungwangi', 'Sungsang', 
  'Dunggulan', 'Kuningan', 'Langkir', 'Medangsia', 'Pujut', 'Pahang', 'Krulut', 'Merakih', 'Tambir', 
  'Medangkungan', 'Matal', 'Uye', 'Menail', 'Prangbakat', 'Bala', 'Ugu', 'Wayang', 'Kelawu', 'Dukut', 'Watugunung'
]

const SASIH_LIST = [
  'Kasa', 'Karo', 'Katiga', 'Kapat', 'Kalima', 'Kanam', 'Kapitu', 'Kawalu', 'Kasanga', 'Kedasa', 'Jyestha', 'Sadha'
]

const sakaInfo = computed(() => kalender.selectedDayInfo.value?.sakaInfo || 'Memuat Data...')

const wukuToday = computed(() => {
  const info = sakaInfo.value
  if (!info || info === 'Tidak Ada Info' || info === 'Memuat Data...') return '-'
  // Search for known wuku name in the string
  const found = WUKU_LIST.find(w => info.includes(w))
  return found || '-'
})

const bulanSaka = computed(() => {
  const info = sakaInfo.value
  if (!info || info === 'Tidak Ada Info' || info === 'Memuat Data...') return 'Sasih'
  
  // 1. Try to find explicit Sasih name in the string
  const found = SASIH_LIST.find(s => info.toLowerCase().includes(s.toLowerCase()))
  if (found) return found
  
  // 2. Fallback to current month approximations if not explicitly in today's info
  // (In a real app, we'd look at the month's Tilem/Purnama, but this is a reasonable approximation)
  const month = kalender.selectedMonth.value
  const monthMap: Record<number, string> = {
    1: 'Kapitu', 2: 'Kawalu', 3: 'Kasanga', 4: 'Kedasa', 5: 'Jyestha', 6: 'Sadha',
    7: 'Kasa', 8: 'Karo', 9: 'Katiga', 10: 'Kapat', 11: 'Kalima', 12: 'Kanam'
  }
  return monthMap[month] || 'Sasih'
})
</script>


