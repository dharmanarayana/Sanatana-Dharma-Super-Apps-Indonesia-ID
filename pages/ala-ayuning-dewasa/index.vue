<template>
  <div class="px-4 lg:px-8 py-6 max-w-4xl mx-auto">
    <!-- Header Page -->
    <header class="mb-8 text-center sm:text-left">
      <div class="flex items-center gap-3 mb-2 justify-center sm:justify-start">
        <div class="w-10 h-10 rounded-xl bg-brand/10 flex items-center justify-center">
          <Icon name="lucide:calendar-heart" class="w-6 h-6 text-brand" />
        </div>
        <h1 class="page-title text-2xl sm:text-3xl">Ala Ayuning Dewasa</h1>
      </div>
      <p class="text-secondary text-sm sm:text-base max-w-2xl">
        Informasi hari baik dan hari buruk (Dewasa Ayu) berdasarkan perhitungan Kalender Bali untuk menunjang aktivitas spiritual dan sosial Anda.
      </p>
    </header>

    <!-- Implementation: Search Mode Toggle -->
    <div class="flex border-b border-brand/10 mb-8 overflow-x-auto no-scrollbar">
      <button 
        @click="viewMode = 'daily'" 
        class="pb-3 px-6 text-sm font-bold transition-all whitespace-nowrap border-b-2"
        :class="viewMode === 'daily' ? 'text-brand border-brand' : 'text-muted border-transparent'"
      >
        Lihat Per Hari
      </button>
      <button 
        @click="viewMode = 'search'" 
        class="pb-3 px-6 text-sm font-bold transition-all whitespace-nowrap border-b-2"
        :class="viewMode === 'search' ? 'text-brand border-brand' : 'text-muted border-transparent'"
      >
        Cari Hari Baik dan Buruk
      </button>
    </div>

    <!-- Daily View Mode -->
    <div v-if="viewMode === 'daily'">
      <!-- Date Picker / Selector -->
      <section class="card bg-surface p-6 mb-8 border-brand/20">
        <div class="flex flex-col sm:flex-row items-center justify-between gap-6">
          <div class="flex items-center gap-4">
            <div class="text-center sm:text-left">
              <p class="text-[10px] font-bold uppercase tracking-widest text-muted mb-1">Tanggal Terpilih</p>
              <h2 class="text-xl font-serif font-bold text-default">
                {{ formattedDate }}
              </h2>
            </div>
          </div>
          
          <div class="flex items-center gap-2">
            <button @click="adjustDate(-1)" class="btn-ghost p-3 rounded-full hover:bg-brand/5 active:scale-90 transition-all border border-default">
              <Icon name="lucide:chevron-left" class="w-5 h-5 text-brand" />
            </button>
            
            <div class="relative">
              <input 
                type="date" 
                v-model="dateInput"
                class="opacity-0 absolute inset-0 w-full h-full cursor-pointer z-10"
              />
              <button class="btn-primary py-2 px-6 flex items-center gap-2 shadow-lg shadow-brand/20">
                <Icon name="lucide:calendar" class="w-4 h-4" />
                <span>Pilih Tanggal</span>
              </button>
            </div>

            <button @click="adjustDate(1)" class="btn-ghost p-3 rounded-full hover:bg-brand/5 active:scale-90 transition-all border border-default">
              <Icon name="lucide:chevron-right" class="w-5 h-5 text-brand" />
            </button>
          </div>
        </div>
      </section>

      <!-- Content List -->
      <div v-if="pending" class="flex flex-col items-center justify-center py-20 opacity-50">
        <Icon name="lucide:loader-2" class="w-10 h-10 animate-spin text-brand mb-4" />
        <p class="font-medium">Mengkalkulasi Dewasa Ayu...</p>
      </div>

      <div v-else-if="error || !dewasaData?.items?.length" class="card bg-surface p-10 text-center border-dashed">
        <Icon name="lucide:calendar-x" class="w-12 h-12 mx-auto text-muted mb-4 opacity-50" />
        <h3 class="font-bold text-default mb-1">Tidak Ada Data Khusus</h3>
        <p class="text-sm text-secondary">Mohon maaf, data dewasa ayu untuk tanggal ini tidak tersedia atau gagal dimuat.</p>
        <button @click="() => refresh()" class="btn-outline mt-6 px-4 py-2 text-xs">Coba Lagi</button>
      </div>

      <div v-else class="grid gap-4 sm:grid-cols-2">
        <div v-for="(item, i) in dewasaData.items" :key="i" 
             class="card bg-surface p-5 hover:border-brand/40 transition-colors group">
          <div class="flex gap-4">
            <div class="w-10 h-10 rounded-lg bg-gold/5 flex-shrink-0 flex items-center justify-center group-hover:bg-brand group-hover:text-white transition-colors duration-300">
              <Icon name="lucide:sparkles" class="w-5 h-5" />
            </div>
            <div>
              <h4 class="font-bold text-brand text-lg mb-1 leading-tight">{{ item.name }}</h4>
              <p class="body-text text-sm leading-relaxed">{{ item.description }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Search View Mode -->
    <div v-if="viewMode === 'search'">
      <section class="card bg-surface p-6 mb-8 border-brand/20">
        <!-- Search Type Toggle -->
        <div class="flex items-center gap-2 p-1 bg-brand/5 rounded-xl border border-brand/10 mb-6 max-w-sm mx-auto sm:mx-0">
          <button 
            @click="searchType = 'baik'"
            class="flex-1 py-2 px-4 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2"
            :class="searchType === 'baik' ? 'bg-brand text-white shadow-md' : 'text-muted hover:bg-brand/10'"
          >
            <Icon name="lucide:smile" class="w-4 h-4" />
            Hari Baik
          </button>
          <button 
            @click="searchType = 'buruk'"
            class="flex-1 py-2 px-4 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2"
            :class="searchType === 'buruk' ? 'bg-red-500 text-white shadow-md' : 'text-muted hover:bg-brand/10'"
          >
            <Icon name="lucide:frown" class="w-4 h-4" />
            Hari Buruk
          </button>
        </div>

        <div class="grid gap-6 sm:grid-cols-3 items-end">
          <div class="space-y-2">
            <label class="text-[10px] font-bold uppercase tracking-widest text-muted">Aktivitas</label>
            <select v-model="searchActivity" class="w-full bg-brand/5 border border-brand/10 p-2 rounded-lg text-sm">
              <option value="pernikahan">Pernikahan / Wiwaha</option>
              <option value="bangunan">Pembangunan / Pindah Rumah</option>
              <option value="pertanian">Pertanian / Perkebunan</option>
              <option value="dagang">Perdagangan / Usaha</option>
              <option value="yadnya">Upacara / Yadnya</option>
              <option value="ternak">Peternakan / Wewalungan</option>
            </select>
          </div>
          <div class="space-y-2">
            <label class="text-[10px] font-bold uppercase tracking-widest text-muted">Bulan & Tahun</label>
            <div class="flex gap-2">
              <select v-model="searchMonth" class="flex-1 bg-brand/5 border border-brand/10 p-2 rounded-lg text-sm">
                <option v-for="m in 12" :key="m" :value="m">{{ getMonthName(m) }}</option>
              </select>
              <select v-model="searchYear" class="w-[100px] bg-brand/5 border border-brand/10 p-2 rounded-lg text-sm">
                <option value="2025">2025</option>
                <option value="2026">2026</option>
              </select>
            </div>
          </div>
          <button @click="performSearch" class="btn-primary py-2 px-6 flex items-center justify-center gap-2 shadow-lg shadow-brand/20 h-[42px]">
            <Icon name="lucide:search" class="w-4 h-4" />
            <span>Cari Hari Baik dan Buruk</span>
          </button>
        </div>
      </section>

      <!-- Search Results -->
      <div v-if="searchPending" class="flex flex-col items-center justify-center py-20 opacity-50">
        <Icon name="lucide:loader-2" class="w-10 h-10 animate-spin text-brand mb-4" />
        <p class="font-medium text-sm">Mencari hari baik...</p>
      </div>

      <div v-else-if="searchResults?.results?.length" class="space-y-4">
        <div v-for="day in searchResults.results" :key="day.date" class="card bg-surface p-6 hover:shadow-lg transition-all border-l-4"
             :class="searchType === 'baik' ? 'border-l-gold' : 'border-l-red-500'">
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
            <h3 class="font-bold text-lg text-brand">{{ formatDate(day.date) }}</h3>
            <button @click="goToDate(day.date)" class="text-xs font-bold text-gold hover:underline flex items-center gap-1">
              Lihat Detail Lengkap <Icon name="lucide:chevron-right" class="w-3 h-3" />
            </button>
          </div>
          <div class="space-y-3">
            <div v-for="(item, idx) in day.items" :key="idx" class="p-3 bg-brand/5 rounded-lg border border-brand/10">
              <div class="flex items-center gap-2 mb-1">
                <Icon :name="searchType === 'baik' ? 'lucide:check-circle' : 'lucide:alert-circle'" 
                      :class="searchType === 'baik' ? 'text-brand' : 'text-red-500'" 
                      class="w-4 h-4" />
                <span class="font-bold text-sm">{{ item.name }}</span>
              </div>
              <p class="text-[13px] text-secondary leading-relaxed pl-6">{{ item.description }}</p>
            </div>
          </div>
        </div>
      </div>

      <div v-else-if="hasSearched" class="card bg-surface p-10 text-center border-dashed border-brand/20">
        <Icon name="lucide:calendar-x" class="w-12 h-12 mx-auto text-muted mb-4 opacity-50" />
        <h3 class="font-bold text-default mb-1">Tidak Ada Hasil</h3>
        <p class="text-sm text-secondary">Tidak ditemukan {{ searchType === 'baik' ? 'hari baik' : 'hari buruk' }} untuk aktivitas "{{ searchActivity }}" di periode ini.</p>
      </div>

      <div v-else class="card bg-surface p-10 text-center border-dashed border-brand/10 opacity-60">
        <Icon :name="searchType === 'baik' ? 'lucide:sparkles' : 'lucide:alert-triangle'" 
              :class="searchType === 'baik' ? 'text-gold/40' : 'text-red-400/40'" 
              class="w-12 h-12 mx-auto mb-4" />
        <h3 class="font-bold text-default mb-1">Mulai Pencarian</h3>
        <p class="text-sm text-secondary px-6">Pilih jenis hari, aktivitas, dan periode untuk menemukan Dewasa Ayu bagi rencana Anda.</p>
      </div>
    </div>

    <!-- Footer Info -->
    <footer class="mt-12 p-6 bg-brand/5 rounded-2xl border border-brand/10">
      <div class="flex items-start gap-4">
        <Icon name="lucide:info" class="w-6 h-6 text-brand flex-shrink-0 mt-1" />
        <div>
          <h5 class="font-bold text-brand text-sm mb-1">Tentang Ala Ayuning Dewasa</h5>
          <p class="text-secondary text-[13px] leading-relaxed">
            Ala Ayuning Dewasa adalah sistem penanggalan Bali yang digunakan untuk menentukan hari baik (Dewasa Ayu) dan hari buruk (Ala) guna melakukan berbagai kegiatan seperti upacara keagamaan, membangun rumah, pertanian, hingga perjalanan. Data disinkronkan dengan perhitungan Kalender Bali Tradisional.
          </p>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { useKalender } from '~/composables/useKalender'
import dayjs from 'dayjs'

const { selectedDate, selectedMonth, selectedYear, monthName: currentMonthName } = useKalender()

// View Mode
const viewMode = ref<'daily' | 'search'>('daily')

// Search State
const searchActivity = ref('pernikahan')
const searchType = ref<'baik' | 'buruk'>('baik')
const searchMonth = ref(new Date().getMonth() + 1)
const searchYear = ref(new Date().getFullYear())
const hasSearched = ref(false)

const { data: searchResults, pending: searchPending, refresh: executeSearch } = useFetch<any>(
  () => `/api/dewasa-search?activity=${searchActivity.value}&bulan=${searchMonth.value}&tahun=${searchYear.value}&type=${searchType.value}`,
  { 
    immediate: false,
    watch: false,
    server: false
  }
)

const performSearch = async () => {
  hasSearched.value = true
  await executeSearch()
}

const getMonthName = (m: number) => {
  return dayjs().month(m - 1).format('MMMM')
}

const formatDate = (dateStr: string) => {
  return dayjs(dateStr).format('dddd, D MMMM YYYY')
}

const goToDate = (dateStr: string) => {
  const d = dayjs(dateStr)
  currentDate.value = d.toDate()
  viewMode.value = 'daily'
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

// Shared state or logic
const currentDate = ref(new Date())

const dateInput = computed({
  get: () => currentDate.value.toISOString().split('T')[0],
  set: (val) => {
    currentDate.value = new Date(val)
  }
})

const formattedDate = computed(() => {
  const options: Intl.DateTimeFormatOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }
  return currentDate.value.toLocaleDateString('id-ID', options)
})

const adjustDate = (days: number) => {
  const d = new Date(currentDate.value)
  d.setDate(d.getDate() + days)
  currentDate.value = d
}

interface DewasaItem {
  name: string
  description: string
}

interface DewasaResponse {
  date: string
  items: DewasaItem[]
  source: string
  error?: string
}

// Fetch fetch logic
const dateParams = computed(() => {
  return `?tanggal=${currentDate.value.getDate()}&bulan=${currentDate.value.getMonth() + 1}&tahun=${currentDate.value.getFullYear()}`
})

const { data: dewasaData, pending, error, refresh } = useFetch<DewasaResponse>(
  () => `/api/dewasa${dateParams.value}`, 
  { 
    lazy: true, 
    server: false,
    watch: [currentDate]
  }
)

useHead({
  title: 'Ala Ayuning Dewasa | Sanatana Dharma Digital',
  meta: [
    { name: 'description', content: 'Informasi lengkap hari baik dan hari buruk (Dewasa Ayu) berdasarkan Kalender Bali.' }
  ]
})
</script>
