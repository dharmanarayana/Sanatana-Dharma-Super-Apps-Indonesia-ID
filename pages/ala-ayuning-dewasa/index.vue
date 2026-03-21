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

const { selectedDate, selectedMonth, selectedYear, monthName } = useKalender()

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

const { data: dewasaData, pending, error, refresh } = useFetch<DewasaResponse>(() => `/api/dewasa${dateParams.value}`, { 
  key: `dewasa-${dateParams.value}`,
  lazy: true, 
  server: false 
})

useHead({
  title: 'Ala Ayuning Dewasa | Sanatana Dharma Digital',
  meta: [
    { name: 'description', content: 'Informasi lengkap hari baik dan hari buruk (Dewasa Ayu) berdasarkan Kalender Bali.' }
  ]
})
</script>
