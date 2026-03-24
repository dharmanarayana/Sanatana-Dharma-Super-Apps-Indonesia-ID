<template>
  <div>
    <UiPageHeader icon="🛕" title="Daftar Pura"
                  subtitle="Temukan tempat suci di sekitar Anda"
                  back-path="/" />
    <div class="px-4 lg:px-0 py-4 grid lg:grid-cols-[280px_1fr] gap-8">
      <!-- Filter Sidebar Desktop -->
      <aside class="hidden lg:block space-y-6">
        <div class="card p-4">
          <h4 class="card-label mb-3 text-muted text-[10px]">Lokasi Anda</h4>
          <button @click="toggleGeo" :class="[
            'w-full py-3 rounded-xl flex items-center justify-center gap-2 transition-all font-bold text-xs mb-2',
            userCoords ? 'bg-brand text-white' : 'bg-surface border border-default text-default hover:border-brand'
          ]">
            <Icon :name="userCoords ? 'lucide:map-pin-off' : 'lucide:locate-fixed'" size="16" />
            {{ userCoords ? 'Matikan GPS' : 'Gunakan GPS' }}
          </button>
          
          <div v-if="geoError" class="p-3 bg-red-50 text-red-600 rounded-lg text-[10px] mb-4 border border-red-100 flex items-start gap-2">
            <Icon name="lucide:alert-circle" size="14" class="shrink-0 mt-0.5" />
            <span>{{ geoError }}</span>
          </div>

          <h4 class="card-label mb-3 text-muted text-[10px]">Filter Provinsi</h4>
          <div class="space-y-4">
            <div class="relative">
              <input v-model="searchProvince" type="text" placeholder="Cari Provinsi..." class="input-field text-xs pl-8 h-10" />
              <span class="absolute left-2.5 top-1/2 -translate-y-1/2 opacity-30 text-xs">🔍</span>
            </div>
            <div class="space-y-2 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
              <label
                v-for="p in filteredProvinceList" :key="p"
                class="flex items-center gap-2 text-xs font-medium cursor-pointer hover:text-brand"
              >
                <input type="checkbox" :value="p" v-model="selectedProvinces" class="rounded border-default text-brand" />
                {{ p }}
              </label>
            </div>
            <button v-if="selectedProvinces.length > 0" @click="selectedProvinces = []" class="text-[10px] text-muted hover:text-brand transition-colors">
              Reset Filter
            </button>
          </div>
        </div>
        <button @click="openMaps" class="btn-primary w-full py-4 justify-center gap-2 bg-charcoal text-white hover:bg-black">
          <span>🗺️</span> Lihat di Peta
        </button>
      </aside>

      <div class="space-y-6">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-default pb-3">
          <div class="relative flex-1 max-w-sm">
            <input v-model="searchQuery" type="text" placeholder="Cari nama Pura..." class="input-field pl-9 h-11" />
            <span class="absolute left-3 top-1/2 -translate-y-1/2 opacity-30">🛕</span>
          </div>
          <div class="flex items-center gap-2">
            <!-- Mobile GPS Toggle -->
            <button @click="toggleGeo" :class="[
              'lg:hidden p-2.5 rounded-xl border transition-all',
              userCoords ? 'bg-brand border-brand text-white' : 'bg-surface border-default text-muted'
            ]">
              <Icon :name="userCoords ? 'lucide:locate-fixed' : 'lucide:locate'" size="18" />
            </button>
            <select v-model="mobileProvince" class="lg:hidden bg-surface border border-default rounded-xl px-3 py-2 text-xs font-bold outline-none focus:border-brand">
              <option value="">Semua Provinsi</option>
              <option v-for="p in provinceList" :key="p" :value="p">{{ p }}</option>
            </select>
            <select v-model="sortOrder" class="bg-surface border border-default rounded-xl px-4 py-2 text-xs font-bold outline-none focus:border-brand">
              <option value="nearest" v-if="userCoords">Terdekat</option>
              <option value="asc">A-Z</option>
              <option value="desc">Z-A</option>
            </select>
          </div>
        </div>

        <div v-if="isLoading" class="py-20 text-center">
          <Icon name="lucide:loader-2" class="animate-spin text-brand mx-auto mb-2" size="40" />
          <p class="text-muted italic">Memuat data pura...</p>
        </div>
        <template v-else>
          <UiGrid v-if="displayedTemples.length > 0" cols="2" gap="md">
            <PuraCard v-for="temple in displayedTemples" :key="temple.$id" :temple="temple" />
          </UiGrid>
          <div v-else class="py-20 text-center card bg-surface/30 border-dashed">
            <p class="text-muted text-sm">Data Pura belum tersedia untuk kriteria ini.</p>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
useSeoMeta({
  title: 'Daftar Pura Hindu Indonesia | Sanatana Dharma',
  ogTitle: 'Cari Pura Hindu Terdekat | Sanatana Dharma',
  description: 'Temukan lokasi Pura Hindu di seluruh Indonesia. Lengkap dengan koordinat GPS, alamat, dan informasi sejarah pura hanya di platform Sanatana Dharma.',
  ogDescription: 'Temukan lokasi Pura Hindu di seluruh Indonesia. Lengkap dengan koordinat GPS, alamat, dan informasi sejarah pura.',
  ogImage: '/og-pura.png',
  twitterCard: 'summary_large_image',
})

const { $appwrite } = useNuxtApp()
const DB_ID = 'sanatana-dharma-db'
const temples = ref<any[]>([])

const searchQuery = ref('')
const searchProvince = ref('')
const selectedProvinces = ref<string[]>([])
const mobileProvince = ref('')
const sortOrder = ref('asc')
const userCoords = ref<{lat: number, lng: number} | null>(null)
const geoError = ref('')
const isLoading = ref(true)

const fetchTemples = async () => {
  try {
    isLoading.value = true
    const res = await $appwrite.databases.listDocuments(DB_ID, 'temples', [
      useAppwriteQuery().limit(200)
    ])
    temples.value = res.documents
  } catch (e: any) {
    console.error('Error fetching temples:', e.message)
  } finally {
    isLoading.value = false
  }
}

const toggleGeo = () => {
    if (userCoords.value) {
        userCoords.value = null
        geoError.value = ''
        selectedProvinces.value = []
        mobileProvince.value = ''
        if (sortOrder.value === 'nearest') sortOrder.value = 'asc'
    } else {
        if (!navigator.geolocation) {
            geoError.value = 'Browser Anda tidak mendukung fitur GPS.'
            return
        }
        
        navigator.geolocation.getCurrentPosition((pos) => {
            userCoords.value = {
                lat: pos.coords.latitude,
                lng: pos.coords.longitude
            }
            sortOrder.value = 'nearest'
            geoError.value = ''
        }, (err) => {
            if (err.code === 1) {
                geoError.value = 'Izin lokasi ditolak. Silakan aktifkan GPS di pengaturan browser Anda untuk fitur ini.'
            } else {
                geoError.value = 'Gagal mendapatkan lokasi: ' + err.message
            }
        })
    }
}



// Haversine formula for distance calculation
const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371 // km
    const dLat = (lat2 - lat1) * Math.PI / 180
    const dLon = (lon2 - lon1) * Math.PI / 180
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
              Math.sin(dLon/2) * Math.sin(dLon/2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
    return R * c
}

// Unique provinces from data
const provinceList = computed(() => {
  const set = new Set(temples.value.map((t: any) => t.province).filter(Boolean))
  return [...set].sort()
})

const filteredProvinceList = computed(() => {
  if (!searchProvince.value) return provinceList.value
  return provinceList.value.filter(p => p.toLowerCase().includes(searchProvince.value.toLowerCase()))
})

const openMaps = () => {
  const queryStr = selectedProvinces.value.length > 0
    ? 'Pura Hindu ' + selectedProvinces.value.join(' ')
    : 'Pura Hindu Indonesia'
  const query = queryStr.replace(/\s+/g, '+')
  window.open(`https://www.google.com/maps/search/${query}`, '_blank')
}

const displayedTemples = computed(() => {
  let result = temples.value.map(t => {
      let distance = null
      // Longitude 0 is not valid for Indonesia (~100-140)
      if (userCoords.value && t.latitude != null && t.longitude != null && Number(t.longitude) !== 0) {
          distance = calculateDistance(userCoords.value.lat, userCoords.value.lng, Number(t.latitude), Number(t.longitude))
      }
      return { ...t, distance }
  })

  // Filter by search text
  if (searchQuery.value.trim()) {
    const q = searchQuery.value.toLowerCase()
    result = result.filter((t: any) =>
      t.name?.toLowerCase().includes(q) ||
      t.city?.toLowerCase().includes(q) ||
      t.province?.toLowerCase().includes(q) ||
      t.address?.toLowerCase().includes(q)
    )
  }

  // Filter by provinces
  const activeProvinces = selectedProvinces.value.length > 0
    ? selectedProvinces.value
    : mobileProvince.value
    ? [mobileProvince.value]
    : []

  if (activeProvinces.length > 0) {
    result = result.filter((t: any) => activeProvinces.includes(t.province))
  }

  // Sort
  if (sortOrder.value === 'nearest' && userCoords.value) {
      result.sort((a, b) => (a.distance ?? Infinity) - (b.distance ?? Infinity))
  } else {
      result.sort((a: any, b: any) =>
        sortOrder.value === 'asc'
          ? a.name?.localeCompare(b.name)
          : b.name?.localeCompare(a.name)
      )
  }

  return result
})

const initGeo = () => {
    if (navigator.geolocation && !userCoords.value) {
        navigator.geolocation.getCurrentPosition((pos) => {
            userCoords.value = {
                lat: pos.coords.latitude,
                lng: pos.coords.longitude
            }
            sortOrder.value = 'nearest'
            geoError.value = ''
        }, (err) => {
            // Silently fail on init to avoid blocking the main view with errors
            if (err.code === 1) {
                console.log('GPS Permission denied on init')
            } else {
                console.error('GPS Error on init:', err.message)
            }
        })
    }
}

onMounted(() => {
    fetchTemples()
    initGeo()
})
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 4px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: var(--color-default);
  opacity: 0.1;
  border-radius: 10px;
}
</style>
