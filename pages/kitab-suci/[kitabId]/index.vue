<template>
  <div class="animate-fade-up min-h-screen bg-base">
    <!-- Header -->
    <div class="sticky top-0 z-30 bg-base/80 backdrop-blur-md px-4 py-4 flex items-center justify-between border-b border-default">
      <div class="flex items-center gap-1">
        <button @click="$router.back()" class="flex items-center gap-1 p-2 -ml-2 rounded-full hover:bg-surface transition-colors text-default font-bold">
          <Icon name="lucide:chevron-left" class="w-6 h-6" />
          <span class="text-sm">Kembali</span>
        </button>
        <h2 class="font-serif font-bold text-default ml-2">Bhagavad Gita</h2>
      </div>
    </div>

    <!-- Book Info -->
    <div class="px-6 py-8">
      <div class="flex gap-6 mb-10">
        <div class="w-32 aspect-[3/4] bg-brand rounded-xl shadow-lg flex-shrink-0 overflow-hidden">
          <img src="https://placehold.jp/24/8b0000/ffffff/300x400.png?text=Bhagavad+Gita" class="w-full h-full object-cover" />
        </div>
        <div class="flex flex-col justify-center">
          <span class="text-[10px] font-bold uppercase tracking-widest text-brand mb-2">Kitab Nyaya</span>
          <h1 class="font-serif text-2xl font-bold text-default leading-tight mb-2">Bhagavad Gita</h1>
          <p class="text-xs text-muted leading-relaxed">Nyanyian Suci Tuhan yang menjelaskan tentang kewajiban dan jalan kehidupan.</p>
        </div>
      </div>

      <!-- Chapter List -->
      <h3 class="font-bold text-sm text-default mb-4 border-b border-default pb-2">Daftar Bab</h3>
      <div class="space-y-3">
        <NuxtLink v-for="i in 18" :key="i" :to="`/kitab-suci/bhagavad-gita/${i}`"
                  class="bg-surface p-4 rounded-xl border border-default flex items-center justify-between group active:scale-[0.98] transition-all">
          <div class="flex items-center gap-4">
            <span class="text-xs font-bold text-muted group-hover:text-brand transition-colors">{{ i }}</span>
            <div>
              <h4 class="text-sm font-bold text-default">Bab {{ i }}: Arjuna Wisada Yoga</h4>
              <p class="text-[10px] text-muted">47 Sloka</p>
            </div>
          </div>
          <Icon name="lucide:chevron-right" class="w-4 h-4 text-muted" />
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({ layout: 'default' })
</script>
