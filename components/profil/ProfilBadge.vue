<template>
  <div class="flex gap-2 mb-6">
    <button v-for="b in ['Dharma', 'Sosial', 'Budaya']" :key="b"
            class="badge px-3 py-1 flex items-center gap-1">
      <span>🏅</span> {{ b }}
    </button>
  </div>
</template>
