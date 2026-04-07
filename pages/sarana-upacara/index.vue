<template>
  <div class="space-y-6 pb-6 relative min-h-[60vh]">
    <UiPageHeader 
      icon="🛍️" 
      title="Sarana Upacara"
      subtitle="Pesan berbagai sarana ritual Hindu dengan mudah dan praktis"
      back-path="/" 
    />

    <div class="px-4 lg:px-0 max-w-7xl mx-auto space-y-6">
      
      <!-- Filter / Search Section -->
      <div class="flex flex-col lg:flex-row gap-4 lg:items-center justify-between bg-surface p-4 rounded-xl border border-default shadow-sm relative z-20">
        
        <!-- Search -->
        <div class="relative w-full lg:w-80">
          <Icon name="lucide:search" class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
          <input 
            v-model="searchQuery"
            type="text" 
            placeholder="Cari sarana upacara..." 
            class="w-full pl-9 pr-4 py-2 border border-default rounded-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary truncate bg-transparent"
          />
        </div>

        <div class="flex flex-col sm:flex-row gap-4 items-start sm:items-center w-full lg:w-auto overflow-x-auto pb-1 sm:pb-0 scrollbar-hide">
          
          <!-- Merchant Actions -->
          <div v-if="authStore.isLoggedIn" class="flex items-center gap-2 border-r border-default pr-4 mr-2 shrink-0">
            <button 
              v-if="!authStore.isMerchant"
              @click="showMerchantInfo = true"
              class="flex items-center gap-2 px-4 py-2 bg-brand text-white rounded-xl text-sm font-bold hover:bg-brand/90 transition-all active:scale-95 shadow-md shadow-brand/20"
            >
              <Icon name="lucide:store" class="w-4 h-4" />
              Pendaftaran Penjual
            </button>
            <button 
              v-else
              @click="navigateTo('/merchant')"
              class="flex items-center gap-2 px-4 py-2 bg-green-500/10 text-green-600 rounded-xl text-sm font-bold hover:bg-green-500/20 transition-all active:scale-95 border border-green-500/20"
            >
              <Icon name="lucide:layout-dashboard" class="w-4 h-4" />
              Dashboard Penjual
            </button>
          </div>

          <!-- Category Filter -->
          <div class="flex items-center gap-2">
            <button 
              v-for="cat in categories" :key="cat"
              @click="activeCategory = cat"
              :class="[
                'px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors border',
                activeCategory === cat 
                  ? 'bg-primary text-primary-foreground border-primary' 
                  : 'bg-transparent border-default text-default hover:bg-default'
              ]"
            >
              {{ cat }}
            </button>
          </div>

          <!-- Location Filter (GPS features) -->
          <div class="relative flex items-center gap-2 mt-2 sm:mt-0 pt-2 sm:pt-0 border-t sm:border-t-0 sm:border-l border-default sm:pl-4 min-w-max">
            <Icon name="lucide:map-pin" class="w-4 h-4 text-muted shrink-0" />
            <select 
              v-model="activeLocation"
              class="bg-transparent border-none text-sm font-medium focus:ring-0 cursor-pointer text-default pr-6 py-1 appearance-none outline-none"
            >
              <option value="Semua Lokasi">Semua Lokasi</option>
              <option v-for="loc in uniqueLocations" :key="loc" :value="loc">{{ loc }}</option>
            </select>

            <!-- GPS Auto-Location Button -->
            <button 
              @click="detectLocation" 
              class="ml-1 p-1.5 rounded-full bg-primary/10 text-primary hover:bg-primary/20 transition-colors flex items-center justify-center relative group"
              title="Gunakan Lokasi Saat Ini (GPS)"
            >
              <Icon v-if="isLocating" name="lucide:loader-2" class="w-4 h-4 animate-spin" />
              <Icon v-else name="lucide:crosshair" class="w-4 h-4" />
              
              <!-- Simple tooltip -->
              <span class="absolute -top-10 right-0 w-max bg-charcoal text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                Deteksi Lokasi Otomatis
              </span>
            </button>
          </div>
          
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="isLoading" class="flex justify-center items-center py-20">
        <Icon name="lucide:loader-2" class="w-10 h-10 animate-spin text-primary" />
      </div>

      <!-- Products Grid -->
      <div v-else-if="filteredProducts.length > 0" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 relative z-10">
        <div 
          v-for="product in filteredProducts" :key="product.$id"
          class="bg-surface border border-default rounded-2xl overflow-hidden hover:shadow-lg transition-shadow flex flex-col"
        >
          <!-- Image Placeholder -->
          <div class="aspect-[4/3] bg-default flex items-center justify-center relative group">
            <img v-if="product.image" :src="product.image" :alt="product.name" class="w-full h-full object-cover" />
            <div v-else class="text-6xl opacity-40">{{ product.icon || '🛍️' }}</div>
            
            <div class="absolute top-2 right-2 flex flex-col items-end gap-1">
              <div class="bg-white/90 dark:bg-black/90 backdrop-blur-sm px-2.5 py-1 rounded-full text-xs font-bold text-brand shadow-sm">
                {{ product.category }}
              </div>
            </div>
          </div>
          
          <!-- Content -->
          <div class="p-4 flex-1 flex flex-col">
            <h3 class="font-bold text-lg leading-tight mb-1 text-default">{{ product.name }}</h3>
            <p class="text-muted text-sm line-clamp-2 mb-3">{{ product.description }}</p>
            
            <div class="mt-auto pt-3 flex items-end justify-between border-t border-default/50">
              <div>
                <span class="text-xs text-muted block mb-0.5">Harga</span>
                <span class="font-bold text-brand text-lg">{{ formatRupiah(product.price) }}</span>
              </div>
              <button 
                @click="buyItem(product)"
                class="bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-2.5 rounded-xl transition-transform active:scale-95 shadow-sm font-bold tracking-wide text-sm flex items-center gap-2"
              >
                + Keranjang
                <Icon name="lucide:shopping-cart" class="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else class="text-center py-12 bg-surface rounded-xl border border-default p-8">
        <div class="w-16 h-16 bg-default rounded-full flex items-center justify-center mx-auto mb-4">
          <Icon name="lucide:package-open" class="w-8 h-8 text-muted" />
        </div>
        <h3 class="text-lg font-bold text-default mb-1">Sarana Tidak Ditemukan</h3>
        <p class="text-muted text-sm">Tidak ada sarana yang sesuai dengan pencarian atau lokasi saat ini.</p>
        <button @click="resetFilters" class="mt-4 px-4 py-2 bg-default rounded-lg text-sm font-medium hover:bg-default/80 transition-colors">
          Tampilkan Semua
        </button>
      </div>

      <!-- Floating Cart Button -->
      <Transition name="fade-up">
        <div v-if="cartStore.totalItems > 0" class="fixed bottom-24 left-1/2 -translate-x-1/2 z-[60] w-[90%] max-w-md">
           <NuxtLink to="/marketplace/checkout" 
                     class="bg-brand text-white p-4 rounded-2xl shadow-2xl flex items-center justify-between border-2 border-white/20 backdrop-blur-md animate-bounce-subtle">
             <div class="flex items-center gap-4 text-left">
                <div class="relative">
                  <Icon name="lucide:shopping-bag" class="w-6 h-6" />
                  <span class="absolute -top-2 -right-2 bg-white text-brand text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center shadow-md">
                    {{ cartStore.totalItems }}
                  </span>
                </div>
                <div>
                   <p class="text-[10px] font-bold uppercase tracking-widest opacity-80">Total Pesanan</p>
                   <p class="text-lg font-bold">{{ formatRupiah(cartStore.totalAmount) }}</p>
                </div>
             </div>
             <div class="flex items-center gap-2 font-black text-sm uppercase tracking-tighter">
                Checkout
                <Icon name="lucide:arrow-right" class="w-5 h-5" />
             </div>
           </NuxtLink>
        </div>
      </Transition>

    </div>

    <!-- Merchant Invitation Modal -->
    <UiModal :show="showMerchantInfo" title="Peluang Kemitraan Penjual" @close="showMerchantInfo = false">
      <div class="text-center space-y-4 py-2">
        <div class="w-20 h-20 bg-brand/10 text-brand rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-brand/20 shadow-inner">
          <Icon name="lucide:store" class="w-10 h-10" />
        </div>
        <h3 class="text-xl font-serif font-bold text-default">Om Swastyastu</h3>
        <p class="text-secondary leading-relaxed">
          Bagi Bapak/Ibu atau rekan-rekan yang berminat untuk bergabung sebagai penjual sarana upacara di platform <strong>Sanatana Dharma</strong>, kami mengundang Anda untuk bekerja sama.
        </p>
        <div class="p-4 bg-default/5 rounded-xl border border-default text-sm italic text-muted">
          "Mari bersama-sama menebarkan manfaat dan memudahkan umat dalam menjalankan swadharma."
        </div>
        <div class="pt-4">
          <p class="text-xs uppercase tracking-widest font-bold text-muted mb-2">Hubungi Tim Administrasi</p>
          <a href="mailto:admin@sanatanadharma.me" class="inline-flex items-center gap-2 text-brand font-bold hover:underline bg-brand/5 px-4 py-2 rounded-lg transition-colors">
            <Icon name="lucide:mail" class="w-4 h-4" />
            admin@sanatanadharma.me
          </a>
        </div>
        <button 
          @click="showMerchantInfo = false"
          class="w-full mt-6 py-3 bg-brand text-white rounded-xl font-bold shadow-lg shadow-brand/20 active:scale-[0.98] transition-all"
        >
          Suksma, Saya Mengerti
        </button>
      </div>
    </UiModal>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'

const { $appwrite, $db } = useNuxtApp()
const authStore = useAuthStore()
const cartStore = useCartStore()
const { becomeMerchant } = useAuth()

const DB_ID = 'sanatana-dharma-db'
const COLL_ID = 'sarana_upacara'

const isLoading = ref(true)
const isUpdatingRole = ref(false)
const showMerchantInfo = ref(false)
const rawProducts = ref<any[]>([])

const buyItem = (product: any) => {
  cartStore.addItem(product)
}

const handleJoinMerchant = async () => {
  if (!confirm('Apakah Anda yakin ingin mendaftar sebagai penjual sarana upacara?')) return
  
  try {
    isUpdatingRole.value = true
    await becomeMerchant()
    alert('Selamat! Anda sekarang terdaftar sebagai penjual. Silakan mulai tambahkan produk Anda.')
  } catch (error: any) {
    alert(error.message || 'Gagal mendaftar sebagai penjual.')
  } finally {
    isUpdatingRole.value = false
  }
}

// Filter States
const searchQuery = ref('')
const activeCategory = ref('Semua')
const activeLocation = ref('Semua Lokasi')
const categories = ['Semua', 'Banten', 'Perlengkapan', 'Upacara']

// GPS States
const isLocating = ref(false)

// Fetch Data from Appwrite
const fetchSarana = async () => {
  try {
    isLoading.value = true
    const res = await $db.listDocuments(DB_ID, COLL_ID)
    rawProducts.value = res.documents
  } catch (error: any) {
    console.error('Failed to fetch sarana catalog:', error)
  } finally {
    isLoading.value = false
  }
}

// Compute dynamic list of unique locations from available products
const uniqueLocations = computed(() => {
  const locs = new Set<string>()
  rawProducts.value.forEach(p => {
    if (p.location) locs.add(p.location.trim())
  })
  return Array.from(locs).sort()
})

// Apply Filters
const filteredProducts = computed(() => {
  let result = rawProducts.value

  if (activeCategory.value !== 'Semua') {
    result = result.filter(p => p.category === activeCategory.value)
  }

  if (activeLocation.value !== 'Semua Lokasi') {
    result = result.filter(p => p.location?.toLowerCase() === activeLocation.value.toLowerCase())
  }

  if (searchQuery.value) {
    const q = searchQuery.value.toLowerCase()
    result = result.filter(p => 
      p.name.toLowerCase().includes(q) || 
      p.description.toLowerCase().includes(q)
    )
  }

  return result
})

const resetFilters = () => {
  searchQuery.value = ''
  activeCategory.value = 'Semua'
  activeLocation.value = 'Semua Lokasi'
}

const formatRupiah = (number: number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(number)
}

// GPS AUTO-FILTER LOGIC
// -----------------------------------------------------------------
const detectLocation = () => {
  if (!navigator.geolocation) {
    alert('Browser Anda tidak mendukung fitur deteksi lokasi.')
    return
  }

  isLocating.value = true
  
  navigator.geolocation.getCurrentPosition(
    async (position) => {
      try {
        const { latitude, longitude } = position.coords
        // Use free OpenStreetMap Nominatim API for Reverse Geocoding
        const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=10`)
        const data = await response.json()
        
        // Ensure data is parsed properly
        if (data && data.address) {
          // Nominatim provides county, city, town, or village depending on the location scale
          const detectedCity = data.address.city || data.address.county || data.address.town || data.address.region
          
          if (detectedCity) {
            // Find fuzzy match in uniqueLocations 
            const cityClean = detectedCity.replace(/kota|kabupaten|regency/i, '').trim().toLowerCase()
            
            const match = uniqueLocations.value.find(loc => loc.toLowerCase().includes(cityClean) || cityClean.includes(loc.toLowerCase()))
            
            if (match) {
              activeLocation.value = match
            } else {
              alert(`GPS Anda terdeteksi di "${detectedCity}", namun belum ada penjual/produk sarana di area ini.`)
            }
          }
        }
      } catch (err) {
        console.error('Failed to reverse geocode:', err)
        alert('Gagal mengambil nama kota dari koordinat Anda.')
      } finally {
        isLocating.value = false
      }
    },
    (error) => {
      isLocating.value = false
      if (error.code === error.PERMISSION_DENIED) {
        alert('Mohon izinkan akses lokasi (GPS) pada browser Anda untuk menggunakan fitur ini.')
      } else {
        alert('Gagal mendeteksi lokasi: ' + error.message)
      }
    },
    { enableHighAccuracy: false, timeout: 10000, maximumAge: 60000 }
  )
}

// Initialization
onMounted(() => {
  fetchSarana()
})
</script>

<style scoped>
/* Remove standard arrow from select for cleaner appearance, except on very standard browsers */
select {
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e");
  background-repeat: no-repeat;
  background-position: right 0.2rem center;
  background-size: 1em;
}
</style>
