<template>
  <div class="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
    <button v-for="c in ['Semua', 'Dharma Wacana', 'Tutorial', 'Kisah']" :key="c"
            class="badge whitespace-nowrap px-4 py-2">
      {{ c }}
    </button>
  </div>
</template>
