<template>
  <div class="card divide-y divide-default overflow-hidden">
    <button v-for="i in ['Keamanan', 'Notifikasi', 'Tampilan', 'Bahasa']" :key="i"
            class="w-full p-4 text-left text-sm font-medium hover:bg-state-hover flex justify-between">
      {{ i }}
      <span class="text-muted">›</span>
    </button>
  </div>
</template>
