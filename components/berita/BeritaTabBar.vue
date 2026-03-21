<template>
  <div class="flex gap-4 border-b border-default overflow-x-auto scrollbar-hide">
    <button v-for="t in ['Terbaru', 'Populer', 'Nasional', 'Budha']" :key="t"
            class="px-4 py-2 text-sm font-bold border-b-2 border-transparent hover:border-brand">
      {{ t }}
    </button>
  </div>
</template>
