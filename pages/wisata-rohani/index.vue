<template>
  <div>
    <UiPageHeader icon="🕉️" title="Wisata Rohani"
                  subtitle="Perjalanan suci menyusuri jejak leluhur"
                  back-path="/" />
    <div class="px-4 lg:px-0 py-4 space-y-8">
      <!-- Featured Banner Desktop -->
      <div class="hidden lg:block h-72 rounded-3xl overflow-hidden relative group">
        <img src="https://placehold.jp/24/8b0000/ffffff/1200x400.png?text=Tirta+Yatra+Eksklusif" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" />
        <div class="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent flex items-center p-12">
          <div class="max-w-lg space-y-4">
            <span class="badge bg-brand">Terpopuler</span>
            <h3 class="text-4xl font-black italic text-white leading-tight">Tirta Yatra Akasa <br/>Lombok - Bali</h3>
            <p class="text-white/70 text-sm italic">"Menyucikan raga dan jiwa di pulau seribu Pura"</p>
            <button class="btn-primary py-3 px-8 text-sm">Pesan Paket Sekarang</button>
          </div>
        </div>
      </div>

      <div>
        <h4 class="card-label mb-6 px-1">Paket Wisata Pilihan</h4>
        <UiGrid cols="3" gap="md">
          <WisataCard v-for="i in 6" :key="i" />
        </UiGrid>
      </div>
    </div>
  </div>
</template>

<script setup>
</script>
