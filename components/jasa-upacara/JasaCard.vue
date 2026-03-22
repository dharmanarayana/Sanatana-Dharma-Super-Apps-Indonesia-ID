<template>
  <div class="bg-surface rounded-2xl border border-default p-4 shadow-sm flex gap-4 hover:border-brand/40 transition-colors cursor-pointer group">
    <div class="w-24 h-24 bg-elevated rounded-xl overflow-hidden flex-shrink-0">
      <NuxtImg src="https://placehold.jp/24/ff6aff/ffffff/200x200.png?text=Banten" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" loading="lazy" />
    </div>
    <div class="flex-grow flex flex-col justify-between">
      <div>
        <h4 class="font-bold text-default text-sm line-clamp-2">Paket Banten Pejati Lengkap</h4>
        <p class="text-[10px] text-muted mt-1 uppercase tracking-wider">Layanan Sarana</p>
      </div>
      <div class="flex items-end justify-between">
        <p class="text-sm font-black text-brand italic">Rp 150.000</p>
        <button class="w-8 h-8 rounded-lg bg-brand/10 text-brand flex items-center justify-center hover:bg-brand hover:text-white transition-colors">
          <Icon name="lucide:shopping-cart" class="w-4 h-4" />
        </button>
      </div>
    </div>
  </div>
</template>
