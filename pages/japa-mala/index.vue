<template>
  <div class="min-h-[calc(100vh-140px)] flex flex-col relative overflow-hidden bg-gradient-to-b from-brand/5 to-transparent">
    
    <!-- Background Elements -->
    <div class="absolute inset-0 z-0 overflow-hidden pointer-events-none opacity-20">
      <div class="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-brand/30 blur-[120px] rounded-full animate-pulse"></div>
      <div class="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-brand/20 blur-[150px] rounded-full animate-pulse opacity-50"></div>
    </div>

    <!-- Page Header -->
    <div class="relative z-10 p-6 flex items-center justify-between">
      <button @click="navigateTo('/')" class="w-10 h-10 rounded-2xl bg-surface border border-default flex items-center justify-center text-muted hover:text-brand transition-all">
        <Icon name="lucide:chevron-left" class="w-5 h-5" />
      </button>
      <div class="text-center">
        <h1 class="text-sm font-black uppercase tracking-[0.3em] text-brand">Japa Mala</h1>
        <p class="text-[10px] font-bold text-muted uppercase tracking-widest mt-0.5">Tasbih Digital</p>
      </div>
      <button @click="showMantraMenu = true" class="w-10 h-10 rounded-2xl bg-surface border border-default flex items-center justify-center text-muted hover:text-brand transition-all">
        <Icon name="lucide:settings-2" class="w-5 h-5" />
      </button>
    </div>

    <!-- Main Counter Content -->
    <div class="flex-1 flex flex-col items-center justify-center p-6 relative z-10">
      
      <!-- Current Mantra -->
      <div class="mb-12 text-center animate-fade-in">
        <span class="text-[10px] font-black uppercase tracking-[0.2em] text-brand/60 mb-2 block">Mantra Aktif</span>
        <h2 class="text-2xl font-black italic text-default tracking-tight">{{ activeMantra }}</h2>
        <div class="mt-2 h-1 w-12 bg-brand/20 mx-auto rounded-full"></div>
      </div>

      <!-- Circular Counter Button -->
      <div class="relative group">
        <!-- Progress Svg -->
        <svg class="w-72 h-72 -rotate-90 drop-shadow-2xl">
          <circle 
            cx="144" cy="144" r="130" 
            class="stroke-brand/5 fill-transparent"
            stroke-width="12" 
          />
          <circle 
             cx="144" cy="144" r="130" 
             class="stroke-brand fill-transparent transition-all duration-300"
             stroke-width="12"
             stroke-linecap="round"
             :stroke-dasharray="816"
             :stroke-dashoffset="dashOffset"
          />
        </svg>

        <!-- Touch Area -->
        <button 
          @pointerdown="isPressing = true"
          @pointerup="isPressing = false"
          @pointerleave="isPressing = false"
          @click="increment"
          class="absolute inset-0 m-auto w-56 h-56 rounded-full bg-surface shadow-[0_20px_50px_rgba(var(--color-brand-rgb),0.2)] border-4 border-white dark:border-default flex flex-col items-center justify-center transition-all active:scale-95 hover:scale-105 overflow-hidden z-20"
          :class="{ 'scale-95 shadow-inner bg-brand/5': isPressing }"
        >
          <!-- Particle Effect -->
          <div v-if="isPressing" class="absolute inset-0 bg-brand/10 animate-ping pointer-events-none"></div>
          
          <div class="text-[10px] font-black uppercase tracking-widest text-brand mb-1 opacity-60">Butir {{ currentInMala }}</div>
          <div class="text-6xl font-black italic text-default tabular-nums select-none">{{ sessionCount }}</div>
          <div class="text-[10px] font-bold text-muted uppercase tracking-[0.1em] mt-2">Ketuk Disini</div>
        </button>
      </div>

      <!-- Stats Bar -->
      <div class="mt-16 grid grid-cols-2 gap-4 w-full max-w-sm">
        <div class="card p-4 text-center bg-surface/40 backdrop-blur-md border border-white/20">
          <div class="text-[10px] font-black uppercase tracking-widest text-muted mb-1">TOTAL HARI INI</div>
          <div class="text-xl font-black italic text-default">{{ totalCount }}</div>
        </div>
        <div class="card p-4 text-center bg-surface/40 backdrop-blur-md border border-white/20 relative overflow-hidden group">
          <div @click="resetSession" class="cursor-pointer">
            <div class="text-[10px] font-black uppercase tracking-widest text-muted mb-1">RESET SESI</div>
            <Icon name="lucide:refresh-cw" class="w-5 h-5 text-brand group-hover:rotate-180 transition-transform duration-500 mx-auto" />
          </div>
        </div>
      </div>
    </div>

    <!-- Mantra Selection Drawer -->
    <Transition name="slide-up">
      <div v-if="showMantraMenu" class="fixed inset-0 z-50 flex items-end">
        <div class="absolute inset-0 bg-black/40 backdrop-blur-sm" @click="showMantraMenu = false"></div>
        <div class="relative w-full bg-surface-variant rounded-t-[40px] p-8 shadow-2xl max-h-[80vh] overflow-y-auto">
          <div class="w-12 h-1.5 bg-default/10 rounded-full mx-auto mb-8"></div>
          
          <h3 class="text-xl font-black italic text-default mb-6">Pilih Mantra Suci</h3>
          <div class="space-y-3">
            <button 
              v-for="m in mantras" :key="m.name" 
              @click="setMantra(m.name); showMantraMenu = false"
              class="w-full flex items-center gap-4 p-5 rounded-3xl border transition-all"
              :class="activeMantra === m.name ? 'bg-brand text-white border-brand shadow-xl shadow-brand/20' : 'bg-surface border-default hover:border-brand/40'"
            >
              <div class="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shadow-inner bg-black/5">
                {{ m.name.includes('Gayatri') ? '☀️' : '🙏' }}
              </div>
              <div class="text-left">
                <div class="text-sm font-black italic">{{ m.name }}</div>
                <div class="text-[10px] font-medium opacity-60">{{ m.meaning }}</div>
              </div>
              <Icon v-if="activeMantra === m.name" name="lucide:check-circle-2" class="w-5 h-5 ml-auto" />
            </button>
          </div>
          <button @click="showMantraMenu = false" class="w-full mt-8 py-4 bg-default/5 rounded-3xl text-sm font-bold text-muted hover:bg-default/10 transition-all">
            Tutup
          </button>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
const { sessionCount, totalCount, activeMantra, mantras, increment, resetSession, setMantra } = useJapaMala()
const showMantraMenu = ref(false)
const isPressing = ref(false)
const isMobile = ref(false)

onMounted(() => {
  isMobile.value = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)
})

const currentInMala = computed(() => {
  const mod = sessionCount.value % 108
  return mod === 0 && sessionCount.value > 0 ? 108 : mod
})

const dashOffset = computed(() => {
  const percentage = (currentInMala.value / 108)
  return 816 * (1 - percentage)
})
</script>

<style scoped>
.slide-up-enter-active, .slide-up-leave-active { transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1); }
.slide-up-enter-from, .slide-up-leave-to { transform: translateY(100%); opacity: 0; }

@keyframes fade-in {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
.animate-fade-in { animation: fade-in 0.8s ease-out; }

.scrollbar-hide::-webkit-scrollbar { display: none; }
.scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
</style>
