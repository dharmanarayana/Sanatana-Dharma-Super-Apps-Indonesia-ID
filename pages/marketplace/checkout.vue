<template>
  <div class="min-h-screen bg-base pb-20">
    <UiPageHeader icon="💳" title="Checkout" subtitle="Selesaikan pesanan sarana upacara Anda" back-path="/sarana-upacara" />

    <div class="px-4 max-w-4xl mx-auto py-8">
      <div v-if="cartStore.isEmpty" class="text-center py-20 bg-surface rounded-3xl border-2 border-dashed border-default p-10">
        <Icon name="lucide:shopping-cart" class="w-20 h-20 mx-auto text-muted mb-6 opacity-20" />
        <h2 class="text-2xl font-serif font-bold text-default mb-2">Keranjang Anda Kosong</h2>
        <p class="text-muted mb-8">Anda belum menambahkan sarana apapun ke keranjang.</p>
        <NuxtLink to="/sarana-upacara" class="btn-primary px-8 py-3 rounded-xl font-bold">Mulai Belanja</NuxtLink>
      </div>

      <div v-else-if="isSuccess" class="text-center py-20 bg-surface rounded-3xl animate-fade-up p-10 border border-green-500/20">
        <div class="w-24 h-24 bg-green-500 text-white rounded-full flex items-center justify-center mx-auto mb-8 shadow-xl shadow-green-500/30">
          <Icon name="lucide:check" class="w-12 h-12" />
        </div>
        <h2 class="text-3xl font-serif font-bold text-default mb-4">Pesanan Berhasil!</h2>
        <p class="text-muted max-w-sm mx-auto mb-10 leading-relaxed">
          Suksma! Pesanan Anda telah diterima dan sedang diproses. Detail pesanan telah dikirim ke WhatsApp penjual.
        </p>
        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <NuxtLink to="/sarana-upacara" class="btn-outline px-8 py-3 rounded-xl font-bold">Lanjut Belanja</NuxtLink>
          <NuxtLink to="/" class="btn-primary px-8 py-3 rounded-xl font-bold">Kembali ke Beranda</NuxtLink>
        </div>
      </div>

      <div v-else class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Order Items -->
        <div class="lg:col-span-2 space-y-6">
          <div class="bg-surface rounded-3xl border border-default p-6 shadow-sm">
            <h3 class="font-serif font-bold text-xl mb-6 flex items-center gap-3">
               <Icon name="lucide:package" class="w-6 h-6 text-brand" />
               Daftar Pesanan
            </h3>
            <div class="divide-y divide-default">
              <div v-for="item in cartStore.items" :key="item.$id" class="py-4 flex gap-4 first:pt-0">
                <div class="w-20 h-20 bg-elevated rounded-2xl flex-shrink-0 flex items-center justify-center overflow-hidden border border-default">
                  <img v-if="item.image" :src="item.image" class="w-full h-full object-cover" />
                  <span v-else class="text-2xl opacity-40">{{ item.icon || '🛍️' }}</span>
                </div>
                <div class="flex-1 min-w-0 flex flex-col justify-center">
                  <h4 class="font-bold text-default line-clamp-1">{{ item.name }}</h4>
                  <div class="flex items-center justify-between mt-2">
                    <p class="text-brand font-bold">{{ formatRupiah(item.price) }}</p>
                    <div class="flex items-center gap-3 border border-default rounded-lg px-2 py-1">
                      <button @click="cartStore.updateQuantity(item.$id, item.quantity - 1)" class="text-muted hover:text-brand transition-colors"><Icon name="lucide:minus" class="w-4 h-4" /></button>
                      <span class="text-sm font-bold tabular-nums w-4 text-center">{{ item.quantity }}</span>
                      <button @click="cartStore.updateQuantity(item.$id, item.quantity + 1)" class="text-muted hover:text-brand transition-colors"><Icon name="lucide:plus" class="w-4 h-4" /></button>
                    </div>
                  </div>
                </div>
                <button @click="cartStore.removeItem(item.$id)" class="text-muted hover:text-red-500 transition-colors self-center p-2">
                  <Icon name="lucide:trash-2" class="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          <!-- Shipping Info -->
          <div class="bg-surface rounded-3xl border border-default p-6 shadow-sm">
            <h3 class="font-serif font-bold text-xl mb-6 flex items-center gap-3">
               <Icon name="lucide:map-pin" class="w-6 h-6 text-brand" />
               Informasi Pengiriman
            </h3>
            <form class="space-y-4">
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div class="space-y-1">
                  <label class="text-[10px] font-bold uppercase tracking-widest text-muted ml-1">Nama Penerima</label>
                  <input v-model="form.name" type="text" class="input-field" placeholder="Masukkan nama" />
                </div>
                <div class="space-y-1">
                  <label class="text-[10px] font-bold uppercase tracking-widest text-muted ml-1">Nomor WhatsApp</label>
                  <input v-model="form.phone" type="tel" class="input-field" placeholder="081xxx" />
                </div>
              </div>
              <div class="space-y-1">
                  <label class="text-[10px] font-bold uppercase tracking-widest text-muted ml-1">Alamat Lengkap</label>
                  <textarea v-model="form.address" class="input-field min-h-[100px] py-3" placeholder="Jalan, No Rumah, Banjar, Desa..."></textarea>
              </div>
            </form>
          </div>
        </div>

        <!-- Summary -->
        <div class="lg:col-span-1">
          <div class="bg-surface rounded-3xl border border-default p-6 shadow-lg sticky top-24">
            <h3 class="font-serif font-bold text-xl mb-6">Ringkasan</h3>
            <div class="space-y-4 mb-8">
              <div class="flex justify-between text-muted">
                <span>Total Item</span>
                <span class="font-bold">{{ cartStore.totalItems }}</span>
              </div>
              <div class="flex justify-between text-muted">
                <span>Subtotal</span>
                <span class="font-bold">{{ formatRupiah(cartStore.totalAmount) }}</span>
              </div>
              <div class="flex justify-between text-muted">
                <span>Ongkos Kirim</span>
                <span class="text-green-500 font-bold">Gratis</span>
              </div>
              <div class="border-t border-default pt-4 flex justify-between">
                <span class="font-bold text-default">Total Bayar</span>
                <span class="font-black text-brand text-xl">{{ formatRupiah(cartStore.totalAmount) }}</span>
              </div>
            </div>

            <button 
              @click="handlePayment"
              :disabled="isProcessing || !isFormValid"
              class="w-full bg-brand text-white py-4 rounded-2xl font-black shadow-xl shadow-brand/20 active:scale-95 transition-all disabled:opacity-50 disabled:grayscale flex items-center justify-center gap-2"
            >
              <Icon v-if="isProcessing" name="lucide:loader-2" class="w-5 h-5 animate-spin" />
              <span v-else>KONFIRMASI PEMBAYARAN</span>
            </button>
            <p class="text-[10px] text-center text-muted mt-4 font-medium italic">
              *Pembayaran disimulasikan menggunakan saldo virtual Sanatana.
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const cartStore = useCartStore()
const isProcessing = ref(false)
const isSuccess = ref(false)

const form = reactive({
  name: '',
  phone: '',
  address: ''
})

const isFormValid = computed(() => {
  return form.name.length > 2 && form.phone.length > 8 && form.address.length > 10
})

const formatRupiah = (num: number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0
  }).format(num)
}

const handlePayment = async () => {
  isProcessing.value = true
  // Simulate API call/processing
  await new Promise(r => setTimeout(r, 2000))
  
  isProcessing.value = false
  isSuccess.value = true
  cartStore.clearCart()
}

useSeoMeta({
  title: 'Checkout - Sanatana Dharma Marketplace',
  description: 'Selesaikan pesanan sarana upacara Anda dengan aman dan cepat.'
})
</script>
