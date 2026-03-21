<template>
  <div class="card p-4 bg-brand/5 border-brand/20">
    <h4 class="card-label">Status Hari Ini</h4>
    <div class="flex gap-2 mt-2">
      <div v-for="i in 3" :key="i" class="w-8 h-8 rounded-full bg-brand text-white flex items-center justify-center text-[10px] font-bold">
        {{ i === 2 ? '✅' : i }}
      </div>
    </div>
  </div>
</template>
