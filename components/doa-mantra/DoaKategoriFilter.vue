<template>
  <div class="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
    <button v-for="c in ['Semua', 'Harian', 'Upacara', 'Puja']" :key="c"
            class="badge whitespace-nowrap px-4 py-2 hover:bg-brand hover:text-white transition-colors">
      {{ c }}
    </button>
  </div>
</template>
