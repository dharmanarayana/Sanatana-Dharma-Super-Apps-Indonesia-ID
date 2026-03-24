<script setup lang="ts">
definePageMeta({
  layout: 'merchant',
  middleware: 'merchant'
})

const stats = [
  { label: 'Total Produk', value: '12', icon: 'lucide:package', color: 'text-blue-500' },
  { label: 'Pesanan Baru', value: '3', icon: 'lucide:shopping-bag', color: 'text-orange-500' },
  { label: 'Pendapatan', value: 'Rp 1.250.000', icon: 'lucide:wallet', color: 'text-green-500' },
  { label: 'Pengunjung', value: '450', icon: 'lucide:users', color: 'text-purple-500' },
]
</script>

<template>
  <div class="space-y-8">
    <div>
      <h2 class="text-2xl font-bold text-default font-serif">Ringkasan Bisnis</h2>
      <p class="text-muted">Pantau performa penjualan sarana upacara Anda di sini.</p>
    </div>

    <!-- Stats Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <div v-for="s in stats" :key="s.label" class="bg-surface p-6 rounded-2xl border border-default shadow-sm hover:shadow-md transition-shadow">
        <div class="flex items-center justify-between mb-4">
          <div :class="['w-12 h-12 rounded-xl flex items-center justify-center bg-gray-50 border border-default', s.color]">
            <Icon :name="s.icon" class="w-6 h-6" />
          </div>
          <span class="text-[10px] font-bold text-green-500 bg-green-50 px-2 py-0.5 rounded-full">+12%</span>
        </div>
        <p class="text-sm font-medium text-muted mb-1">{{ s.label }}</p>
        <p class="text-xl font-bold text-default">{{ s.value }}</p>
      </div>
    </div>

    <!-- Charts / Activity Placeholder -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div class="bg-surface p-6 rounded-2xl border border-default min-h-[300px] flex flex-col">
        <h3 class="font-bold text-lg mb-4">Aktivitas Terakhir</h3>
        <div class="flex-1 flex flex-col items-center justify-center text-center p-8 opacity-40">
           <Icon name="lucide:activity" class="w-12 h-12 mb-2" />
           <p class="text-sm font-medium">Belum ada aktivitas terbaru hari ini.</p>
        </div>
      </div>
      <div class="bg-surface p-6 rounded-2xl border border-default min-h-[300px] flex flex-col">
        <h3 class="font-bold text-lg mb-4">Tips Penjualan</h3>
        <div class="space-y-4">
            <div class="p-4 rounded-xl bg-orange-50 border border-orange-100 flex gap-4">
                <Icon name="lucide:lightbulb" class="w-5 h-5 text-orange-500 shrink-0" />
                <p class="text-xs text-orange-800 leading-relaxed font-medium">
                    Gunakan foto produk yang terang dan jelas untuk meningkatkan minat pembeli hingga 40%.
                </p>
            </div>
            <div class="p-4 rounded-xl bg-blue-50 border border-blue-100 flex gap-4">
                <Icon name="lucide:info" class="w-5 h-5 text-blue-500 shrink-0" />
                <p class="text-xs text-blue-800 leading-relaxed font-medium">
                    Pastikan stok sarana banten selalu diperbarui menjelang hari raya Galungan & Kuningan.
                </p>
            </div>
        </div>
      </div>
    </div>
  </div>
</template>
