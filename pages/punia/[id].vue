<script setup lang="ts">
const route = useRoute()
const { $appwrite } = useNuxtApp()
const authStore = useAuthStore()

const DB_ID = 'sanatana-dharma-db'
const COLL_ID = 'punia_campaigns'

const isLoading = ref(true)
const campaign = ref<any>(null)
const donationAmount = ref(50000)
const isAnonymous = ref(false)
const showCheckout = ref(false)

const presets = [10000, 50000, 100000, 250000, 500000]

const fetchCampaign = async () => {
  try {
    isLoading.value = true
    const id = route.params.id as string
    
    // In demo mode, if ID is 1, 2, or 3, we use mock data
    if (['1', '2', '3'].includes(id)) {
       const mocks: any = {
         '1': {
            $id: '1',
            name: 'Renovasi Pura Luhur Batukaru',
            category: 'Pura',
            description: 'Penjor hiasan di Pura Luhur Batukaru mengalami kerusakan parah akibat badai baru-baru ini. Kami berencana merestorasi arsitektur tradisional Bali yang menjadi ciri khas Pura ini untuk menjaga kelestarian warisan budaya dunia.\n\nSetiap Rupiah yang Anda donasikan akan digunakan untuk pembelian material batu paras, ukiran kayu jati, dan upah para seniman ukir lokal.',
            target_amount: 500000000,
            current_amount: 151250000,
            image: 'https://images.unsplash.com/photo-1590059530472-7634f31c238b?auto=format&fit=crop&q=80&w=1200',
            days_left: 12,
            donors_count: 342,
            recent_donors: [
              { name: 'Wayan S.', amount: 500000, time: '2 jam lalu' },
              { name: 'Hamba Tuhan', amount: 100000, time: '5 jam lalu' },
              { name: 'Made Karta', amount: 250000, time: 'Yesterday' }
            ]
         },
         '2': {
            $id: '2',
            name: 'Beasiswa Anak Ashram',
            category: 'Pendidikan',
            description: 'Ashram di Bali Timur saat ini menampung 50 anak yatim piatu dan kurang mampu. Mereka membutuhkan biaya SPP, seragam, dan alat tulis untuk tahun ajaran baru.\n\nMari bantu mereka meraih cita-cita melalui pendidikan yang layak.',
            target_amount: 75000000,
            current_amount: 68000000,
            image: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&q=80&w=1200',
            days_left: 5,
            donors_count: 89,
            recent_donors: [
              { name: 'Budi Santoso', amount: 1000000, time: '1 jam lalu' },
              { name: 'Ni Made L.', amount: 50000, time: '3 jam lalu' }
            ]
         }
       }
       campaign.value = mocks[id] || mocks['1']
    } else {
       const res = await $appwrite.databases.getDocument(DB_ID, COLL_ID, id)
       campaign.value = res
    }
  } catch (error: any) {
    console.error('Failed to fetch campaign detail:', error.message)
  } finally {
    isLoading.value = false
  }
}

const calculateProgress = (current: number, target: number) => {
  return Math.min(Math.round((current / target) * 100), 100)
}

const formatCurrency = (num: number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0
  }).format(num)
}

const processDonation = () => {
    // Navigate to a simulation of success or payment
    alert(`Mengarahkan ke pembayaran sebesar ${formatCurrency(donationAmount.value)}...`)
    showCheckout.value = false
    navigateTo('/punia/success')
}

onMounted(() => {
  fetchCampaign()
})
</script>

<template>
  <div class="min-h-screen pb-24 bg-base">
    <!-- Header with Back -->
    <div class="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-default h-16 flex items-center px-4">
       <button @click="$router.back()" class="w-10 h-10 rounded-full hover:bg-default flex items-center justify-center transition-colors text-default">
          <Icon name="lucide:chevron-left" class="w-6 h-6" />
       </button>
       <span v-if="campaign" class="ml-2 font-bold text-default truncate">{{ campaign.name }}</span>
    </div>

    <div v-if="isLoading" class="flex flex-col items-center justify-center py-20 gap-4">
       <Icon name="lucide:loader-2" class="w-10 h-10 animate-spin text-brand" />
       <p class="text-sm font-medium text-muted">Sedang mengambil data...</p>
    </div>

    <div v-else-if="campaign" class="max-w-4xl mx-auto">
      <!-- Image & Progress Overlay -->
      <div class="relative w-full aspect-[21/9] md:rounded-3xl overflow-hidden md:mt-6 shadow-2xl">
         <img :src="campaign.image" class="w-full h-full object-cover" />
         <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
         <div class="absolute bottom-6 left-6 right-6 space-y-3 text-white">
            <span class="px-3 py-1 bg-brand text-white text-[10px] font-black uppercase rounded-full tracking-widest shadow-lg">
               {{ campaign.category }}
            </span>
            <h1 class="text-4xl font-black italic tracking-tighter">{{ campaign.name }}</h1>
         </div>
      </div>

      <!-- Main Grid -->
      <div class="grid grid-cols-1 lg:grid-cols-[1fr_350px] gap-8 mt-8 px-4 md:px-0">
         <!-- Content Column -->
         <div class="space-y-8">
            <section class="space-y-4">
               <div class="flex items-center gap-2 mb-4">
                  <div class="w-1.5 h-6 bg-brand rounded-full"></div>
                  <h2 class="text-xl font-black italic tracking-tight text-default">Rincian Campaign</h2>
               </div>
               <div class="prose prose-p:text-secondary prose-p:leading-relaxed max-w-none whitespace-pre-wrap">
                  {{ campaign.description }}
               </div>
            </section>

            <!-- Impact Summary -->
            <div class="grid grid-cols-3 gap-4 bg-surface p-6 rounded-3xl border border-default shadow-sm border-b-4 border-b-brand/20">
               <div class="text-center">
                  <p class="text-[10px] font-black text-muted uppercase tracking-widest mb-1">Target</p>
                  <p class="text-xs font-bold text-default">{{ formatCurrency(campaign.target_amount) }}</p>
               </div>
               <div class="text-center border-x border-default/50">
                  <p class="text-[10px] font-black text-muted uppercase tracking-widest mb-1">Donatur</p>
                  <p class="text-xs font-bold text-default">{{ campaign.donors_count || 0 }} Orang</p>
               </div>
               <div class="text-center">
                  <p class="text-[10px] font-black text-muted uppercase tracking-widest mb-1">Sisa Hari</p>
                  <p class="text-xs font-bold text-default">{{ campaign.days_left }} Hari</p>
               </div>
            </div>

            <!-- Transparency / Activity -->
            <section class="space-y-6">
               <div class="flex items-center justify-between">
                  <h3 class="font-bold text-default">Daftar Donatur Terakhir</h3>
                  <button class="text-xs text-brand font-bold hover:underline">Lihat Semua</button>
               </div>
               <div class="space-y-3">
                  <div v-for="d in campaign.recent_donors" :key="d.name" 
                       class="flex items-center gap-4 p-4 rounded-3xl bg-surface border border-default/50">
                     <div class="w-10 h-10 rounded-full bg-default flex items-center justify-center text-sm font-black text-muted">
                        {{ d.name.charAt(0) }}
                     </div>
                     <div class="flex-1">
                        <div class="flex items-center justify-between font-bold text-sm">
                           <span class="text-default">{{ d.name }}</span>
                           <span class="text-brand">{{ formatCurrency(d.amount) }}</span>
                        </div>
                        <p class="text-[10px] text-muted">{{ d.time }}</p>
                     </div>
                  </div>
               </div>
            </section>
         </div>

         <!-- Sticky Sidebar -->
         <aside class="space-y-6">
            <div class="sticky top-24 bg-surface p-6 rounded-3xl border border-default shadow-xl space-y-6 border-t-8 border-t-brand">
               <div>
                  <div class="flex items-end justify-between font-bold mb-2">
                     <span class="text-2xl text-brand">{{ calculateProgress(campaign.current_amount, campaign.target_amount) }}%</span>
                     <span class="text-muted text-xs">Terkumpul</span>
                  </div>
                  <div class="h-3 w-full bg-default rounded-full overflow-hidden">
                     <div class="h-full bg-brand rounded-full transition-all duration-1000" 
                          :style="{ width: calculateProgress(campaign.current_amount, campaign.target_amount) + '%' }">
                     </div>
                  </div>
                  <p class="text-[10px] text-muted mt-3 font-bold text-center">
                     Mencapai {{ formatCurrency(campaign.current_amount) }} dari total target.
                  </p>
               </div>

               <button @click="showCheckout = true" 
                       class="w-full bg-brand text-white p-4 rounded-2xl font-black uppercase tracking-widest text-sm shadow-lg shadow-brand/20 active:scale-95 transition-all flex items-center justify-center gap-3 group">
                  Beri Punia Sekarang
                  <Icon name="lucide:heart" class="w-5 h-5 group-hover:scale-125 transition-transform" />
               </button>

               <div class="p-4 bg-default/5 rounded-2xl border border-default">
                  <p class="text-[10px] text-muted leading-relaxed italic text-center">
                     "Dana punia yang ikhlas adalah jalan menuju ketenangan hati."
                  </p>
               </div>
            </div>
         </aside>
      </div>
    </div>

    <!-- Donation Checkout Modal -->
    <UiModal :show="showCheckout" title="Donasi Punia" @close="showCheckout = false">
       <div class="space-y-6 pt-2 pb-4">
          <!-- Amount Preset -->
          <div class="space-y-3">
             <label class="text-[10px] font-black text-muted uppercase tracking-widest">Pilih Nominal Punia</label>
             <div class="grid grid-cols-3 gap-2">
                <button v-for="p in presets" :key="p"
                        @click="donationAmount = p"
                        :class="[
                          'py-2 rounded-xl text-xs font-bold border transition-all',
                          donationAmount === p 
                            ? 'bg-brand text-white border-brand shadow-md shadow-brand/20' 
                            : 'bg-surface border-default text-default hover:border-brand/40'
                        ]">
                   {{ Math.floor(p/1000) }}k
                </button>
             </div>
             <div class="relative">
                <span class="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-muted">Rp</span>
                <input v-model="donationAmount" type="number" 
                       class="w-full pl-12 pr-4 py-3 rounded-2xl border-2 border-default focus:border-brand outline-none font-bold text-lg text-default" />
             </div>
          </div>

          <!-- Anonymous Option -->
          <div class="flex items-center gap-3 p-4 bg-default/5 rounded-2xl border border-default cursor-pointer" 
               @click="isAnonymous = !isAnonymous">
             <div class="w-6 h-6 rounded-lg border-2 border-default flex items-center justify-center transition-colors"
                  :class="isAnonymous ? 'bg-brand border-brand' : ''">
                <Icon v-if="isAnonymous" name="lucide:check" class="w-4 h-4 text-white" />
             </div>
             <div class="flex-1">
                <p class="text-xs font-bold text-default">Sembunyikan Nama (Hamba Tuhan)</p>
                <p class="text-[10px] text-muted">Aksi derma Anda tidak akan menampilkan profil publik Anda.</p>
             </div>
          </div>

          <!-- Payment Button -->
          <button @click="processDonation" 
                  class="w-full bg-brand text-white p-4 rounded-2xl font-black uppercase tracking-widest text-sm shadow-xl shadow-brand/20 active:scale-95 transition-all">
             Lanjutkan Pembayaran
          </button>
          
          <p class="text-[10px] text-center text-muted px-6">
             *Dengan memberi punia, Anda menyetujui syarat & ketentuan penggalangan dana umat Sanatana Dharma.
          </p>
       </div>
    </UiModal>
  </div>
</template>
