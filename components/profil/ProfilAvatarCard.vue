<template>
  <div class="card p-6 text-center border-b-4 border-brand/20">
    <div class="w-24 h-24 rounded-full bg-brand/10 mx-auto mb-4 border-4 border-brand/5 flex items-center justify-center text-4xl shadow-inner relative overflow-hidden group">
      <span class="group-hover:scale-110 transition-transform duration-300">👤</span>
      <div class="absolute inset-0 bg-brand/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
    </div>
    <div class="flex items-center justify-center gap-2">
      <h3 class="font-black italic text-xl text-default">{{ authStore.user?.name || 'Umat Sanatana' }}</h3>
      <span v-if="authStore.isAdmin" class="bg-blue-500 text-white text-[8px] px-1.5 py-0.5 rounded-full flex items-center gap-0.5 shadow-sm" title="Verified Admin">
        <span class="text-[10px]">✓</span> 
        <span class="font-black italic uppercase">ADMIN</span>
      </span>
    </div>
    <p class="text-[10px] font-bold text-muted uppercase tracking-widest mt-1">
      Lvl {{ level }} • {{ rank }}
    </p>
    <div class="mt-4 flex justify-center gap-2">
      <button class="btn-primary py-2 px-6 text-[10px] font-black italic">Sunting Profil ⚙️</button>
    </div>
  </div>
</template>

<script setup lang="ts">
const authStore = useAuthStore()
defineProps<{
  level: number
  rank: string
}>()
</script>
