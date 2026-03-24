<template>
  <div class="min-h-screen flex items-center justify-center p-6 bg-base">
    <div class="max-w-md w-full bg-surface p-10 rounded-[3rem] border border-default shadow-2xl text-center space-y-6 relative overflow-hidden">
        <!-- Decorative Icon -->
        <div class="w-24 h-24 bg-brand/10 text-brand rounded-full flex items-center justify-center mx-auto mb-6 scale-110 animate-bounce-subtle">
           <Icon name="lucide:heart" class="w-12 h-12 fill-brand" />
        </div>

        <h2 class="text-3xl font-black italic tracking-tighter text-default">Matur Suksma!</h2>
        <p class="text-secondary leading-relaxed">
           Terima kasih atas dana punia yang telah Anda berikan. Derma Anda sangat berarti bagi kemanusiaan dan pelestarian dharma.
        </p>

        <div class="p-6 bg-default/5 rounded-3xl border border-default space-y-3">
           <p class="text-[10px] font-black text-muted uppercase tracking-widest leading-none">Status Transaksi</p>
           <div class="flex items-center justify-center gap-2 text-green-500 font-bold text-sm uppercase tracking-tighter">
              <Icon name="lucide:check-circle" class="w-5 h-5" />
              Berhasil Membantu
           </div>
        </div>

        <div class="pt-6 space-y-3">
           <button @click="navigateTo('/punia')" 
                   class="w-full bg-brand text-white py-4 rounded-2xl font-black uppercase tracking-widest text-sm shadow-xl shadow-brand/20 active:scale-95 transition-all">
              Kembali ke Beranda Dana Punia
           </button>
           <button @click="navigateTo('/')" 
                   class="w-full py-4 rounded-2xl font-black uppercase tracking-widest text-xs text-muted hover:bg-default/5 transition-all">
              Ke Dashboard App
           </button>
        </div>

        <!-- Spiritual Quote -->
        <div class="pt-8 opacity-40">
           <p class="text-[10px] font-serif italic italic leading-relaxed px-4">
              "Kekayaan yang paling sejati adalah apa yang kita berikan kepada orang lain demi kebajikan."
           </p>
        </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Basic view page
</script>
