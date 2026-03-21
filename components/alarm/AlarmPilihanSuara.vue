<template>
  <div class="grid grid-cols-2 gap-2">
    <button v-for="s in ['Genta', 'Gong', 'Suling', 'OM']" :key="s"
            class="badge py-3 hover:bg-brand hover:text-white transition-colors">
      {{ s }}
    </button>
  </div>
</template>
