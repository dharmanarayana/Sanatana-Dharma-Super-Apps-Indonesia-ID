<template>
  <div>
    <UiPageHeader icon="❤️" title="Dana Punia"
                  subtitle="Berbagi kasih untuk sesama dan tempat suci"
                  back-path="/" />
    <div class="px-4 lg:px-0 py-4 space-y-8">
      <DonasiHeroCounter />
      
      <div>
        <div class="flex items-center justify-between mb-6 px-1">
          <h4 class="card-label text-muted text-[10px]">PROGRAM DANA PUNIA PILIHAN</h4>
          <div class="flex gap-2">
             <button v-for="t in ['Terbaru', 'Hampir Selesai']" :key="t"
                     class="text-[10px] font-bold border border-default px-3 py-1 rounded-full hover:bg-brand/5 transition-colors">
               {{ t }}
             </button>
          </div>
        </div>
        <UiGrid v-if="programs.length > 0" cols="2" gap="md">
          <ProgramDonasiCard v-for="p in programs" :key="p.$id" :program="p" @click="openPaymentModal(p)" />
        </UiGrid>
        <div v-else class="py-12 text-center card bg-surface/50 border-dashed">
          <p class="text-muted text-sm">Belum ada program dana punia aktif saat ini.</p>
        </div>
      </div>
    </div>

    <!-- Payment Modal -->
    <UiModal :show="showPayModal" @close="showPayModal = false" :title="selectedProgram?.title || 'Donasi'">
      <div class="space-y-6">
        <!-- Nominal Selection -->
        <div v-if="!showPaymentDetails" class="space-y-6">
          <div class="grid grid-cols-2 gap-3">
            <button v-for="n in [50000, 100000, 250000, 500000]" :key="n"
                    @click="selectedAmount = n"
                    :class="['p-4 border-2 rounded-2xl font-black italic transition-all text-center', 
                             selectedAmount === n ? 'border-brand bg-brand/5 text-brand' : 'border-default']">
              Rp {{ n.toLocaleString('id-ID') }}
            </button>
            <div class="col-span-2 relative">
              <input type="number" v-model="selectedAmount" placeholder="Nominal Lainnya..." class="input-field h-14 pl-12 text-sm font-bold" />
              <span class="absolute left-4 top-1/2 -translate-y-1/2 opacity-30 font-bold">Rp</span>
            </div>
          </div>
          <button @click="showPaymentDetails = true" class="btn-primary w-full py-4 justify-center text-sm font-black italic" :disabled="!selectedAmount">
            LANJUTKAN KE PEMBAYARAN 💳
          </button>
        </div>

        <!-- Payment Details (QRIS / Banks) -->
        <div v-else class="space-y-6">
          <div class="p-4 bg-brand/5 rounded-2xl border border-brand/10 text-center">
            <p class="text-[10px] font-bold text-muted uppercase tracking-widest mb-1">Total Donasi</p>
            <p class="text-2xl font-black italic text-brand">Rp {{ selectedAmount?.toLocaleString('id-ID') }}</p>
          </div>

          <div class="space-y-4">
            <!-- QRIS Section -->
            <div v-if="selectedProgram?.qrisImage" class="space-y-2 text-center">
              <p class="text-[10px] font-bold text-muted uppercase">Scan QRIS</p>
              <div class="bg-white p-4 rounded-2xl border border-default inline-block mx-auto">
                <img :src="selectedProgram.qrisImage" class="w-48 h-48 object-contain" />
              </div>
            </div>

            <!-- Banks Section -->
            <div class="space-y-3">
              <p class="text-[10px] font-bold text-muted uppercase">Transfer Bank</p>
              <div class="space-y-2">
                <template v-for="i in [1, 2, 3]" :key="i">
                  <div v-if="selectedProgram?.[`bank${i}`]" class="card p-4 bg-surface">
                    <div class="flex justify-between items-center mb-1">
                      <span class="text-xs font-black italic text-brand">{{ selectedProgram[`bank${i}`] }}</span>
                      <button @click="copyToClipboard(selectedProgram[`accountNumber${i}`])" class="text-[10px] text-muted hover:text-brand font-bold uppercase tracking-tighter">Copy No. Rek</button>
                    </div>
                    <p class="text-sm font-bold">{{ selectedProgram[`accountNumber${i}`] }}</p>
                    <p class="text-[10px] text-muted">{{ selectedProgram[`accountName${i}`] }}</p>
                  </div>
                </template>
              </div>
            </div>
          </div>

          <div class="flex gap-2">
            <button @click="showPaymentDetails = false" class="flex-1 py-4 bg-default rounded-2xl text-[10px] font-black italic uppercase">
              KEMBALI
            </button>
            <button @click="confirmDonation" class="flex-[2] btn-primary py-4 justify-center text-[10px] font-black italic uppercase">
              KONFIRMASI SUDAH BAYAR ✅
            </button>
          </div>
        </div>
      </div>
    </UiModal>
  </div>
</template>

<script setup lang="ts">
const { $appwrite, $db } = useNuxtApp()
const DB_ID = 'sanatana-dharma-db'

const programs = ref<any[]>([])
const showPayModal = ref(false)
const showPaymentDetails = ref(false)
const selectedProgram = ref<any>(null)
const selectedAmount = ref<number | null>(null)

const fetchPrograms = async () => {
  try {
    const res = await $db.listDocuments(DB_ID, 'donations', [
      useAppwriteQuery().orderDesc('$createdAt')
    ])
    programs.value = res.documents
  } catch (e: any) {
    console.error('Error fetching donations:', e.message)
  }
}

const openPaymentModal = (program: any) => {
  selectedProgram.value = program
  selectedAmount.value = null
  showPaymentDetails.value = false
  showPayModal.value = true
}

const copyToClipboard = (text: string) => {
  navigator.clipboard.writeText(text)
  alert('Nomor rekening disalin ke clipboard! 📋')
}

const confirmDonation = () => {
  alert('Terima kasih atas kepedulian Anda! Silakan kirimkan bukti transfer melalui fitur Chat admin jika diperlukan. 🙏')
  showPayModal.value = false
}

onMounted(fetchPrograms)
</script>
