<template>
  <div v-if="totalPages > 1" class="flex items-center justify-center gap-2 mt-12 py-8 border-t border-default/50 animate-fade-up">
    <!-- Prev -->
    <button 
      @click="changePage(modelValue - 1)"
      :disabled="modelValue <= 1"
      class="p-2 rounded-xl border border-default bg-surface/50 backdrop-blur-sm hover:bg-surface disabled:opacity-20 disabled:cursor-not-allowed transition-all active:scale-95 group"
      title="Halaman Sebelumnya"
    >
      <Icon name="lucide:chevron-left" class="w-5 h-5 group-hover:-translate-x-0.5 transition-transform" />
    </button>
    
    <!-- Pages -->
    <div class="flex items-center gap-2">
      <button 
        v-for="page in visiblePages" 
        :key="page"
        @click="typeof page === 'number' ? changePage(page) : null"
        class="min-w-[42px] h-[42px] rounded-xl font-bold transition-all flex items-center justify-center text-sm"
        :class="[
          modelValue === page 
            ? 'bg-brand text-white shadow-xl shadow-brand/40 scale-110 z-10' 
            : typeof page === 'number'
              ? 'bg-surface/30 text-muted hover:text-default border border-default/50 hover:border-brand/50 hover:bg-brand/5'
              : 'cursor-default text-muted'
        ]"
      >
        {{ page }}
      </button>
    </div>

    <!-- Next -->
    <button 
      @click="changePage(modelValue + 1)"
      :disabled="modelValue >= totalPages"
      class="p-2 rounded-xl border border-default bg-surface/50 backdrop-blur-sm hover:bg-surface disabled:opacity-20 disabled:cursor-not-allowed transition-all active:scale-95 group"
      title="Halaman Berikutnya"
    >
      <Icon name="lucide:chevron-right" class="w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
    </button>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  modelValue: number
  totalItems: number
  itemsPerPage: number
}>()

const emit = defineEmits(['update:modelValue', 'change'])

const totalPages = computed(() => Math.ceil(props.totalItems / props.itemsPerPage))

const visiblePages = computed(() => {
  const current = props.modelValue
  const total = totalPages.value
  const delta = 2
  const left = current - delta
  const right = current + delta + 1
  const range = []
  const rangeWithDots = []
  let l

  for (let i = 1; i <= total; i++) {
    if (i === 1 || i === total || (i >= left && i < right)) {
      range.push(i)
    }
  }

  for (const i of range) {
    if (l) {
      if (i - l === 2) {
        rangeWithDots.push(l + 1)
      } else if (i - l !== 1) {
        rangeWithDots.push('...')
      }
    }
    rangeWithDots.push(i)
    l = i
  }

  return rangeWithDots
})

const changePage = (page: number) => {
  if (page >= 1 && page <= totalPages.value) {
    emit('update:modelValue', page)
    emit('change', page)
  }
}
</script>

<style scoped>
button {
  -webkit-tap-highlight-color: transparent;
}
</style>
