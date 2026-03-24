<script setup lang="ts">
const { campaigns, loading: isLoading, fetchCampaigns, subscribe, stop } = usePunia()
const activeCategory = ref('Semua')
const categories = ['Semua', 'Pura', 'Sosial', 'Pendidikan', 'Bencana']

const filteredCampaigns = computed(() => {
  if (activeCategory.value === 'Semua') return campaigns.value
  return campaigns.value.filter(c => c.category === activeCategory.value)
})

const calculateProgress = (current: number, target: number) => {
  if (!target) return 0
  return Math.min(Math.round((current / target) * 100), 100)
}

const formatCurrency = (num: number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0
  }).format(num || 0)
}

onMounted(() => {
  fetchCampaigns()
  subscribe()
})

onUnmounted(() => {
  stop()
})
</script>

<template>
  <div class="space-y-6 pb-20">
    <UiPageHeader 
      icon="🙏" 
      title="Dana Punia & Donasi"
      subtitle="Saluran dana punia untuk kemanusiaan dan pelestarian dharma"
      back-path="/" 
    />

    <!-- Category Filter -->
    <div class="px-4 lg:px-0 max-w-5xl mx-auto overflow-x-auto scrollbar-hide flex items-center gap-3 py-2">
      <button 
        v-for="cat in categories" :key="cat"
        @click="activeCategory = cat"
        :class="[
          'px-6 py-2 rounded-full text-sm font-bold transition-all border shrink-0',
          activeCategory === cat 
            ? 'bg-brand text-white border-brand shadow-lg shadow-brand/20 scale-105' 
            : 'bg-surface border-default text-muted hover:border-brand/40'
        ]"
      >
        {{ cat }}
      </button>
    </div>

    <!-- Campaigns Grid -->
    <div class="px-4 lg:px-0 max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
      <div v-for="c in filteredCampaigns" :key="c.$id" 
           class="group bg-surface rounded-3xl border border-default overflow-hidden flex flex-col hover:shadow-2xl hover:shadow-brand/5 transition-all duration-300">
        
        <!-- Hero Image -->
        <div class="relative aspect-video overflow-hidden">
          <img :src="c.image" class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
          <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
          <div class="absolute bottom-4 left-4">
             <span class="px-3 py-1 bg-white/20 backdrop-blur-md text-white text-[10px] font-black uppercase rounded-full border border-white/20">
               {{ c.category }}
             </span>
          </div>
        </div>

        <!-- Content -->
        <div class="p-6 flex-1 flex flex-col">
          <h3 class="text-xl font-bold text-default mb-2 leading-tight group-hover:text-brand transition-colors">{{ c.name }}</h3>
          <p class="text-sm text-muted line-clamp-2 mb-6 leading-relaxed">{{ c.description }}</p>

          <!-- Progress -->
          <div class="space-y-4 mt-auto">
            <div class="flex items-end justify-between text-xs font-bold mb-1">
              <span class="text-brand">{{ calculateProgress(c.current_amount, c.target_amount) }}% Terkumpul</span>
              <span class="text-muted">Target: {{ formatCurrency(c.target_amount) }}</span>
            </div>
            <div class="h-2.5 w-full bg-default rounded-full overflow-hidden">
               <div class="h-full bg-brand rounded-full transition-all duration-1000" 
                    :style="{ width: calculateProgress(c.current_amount, c.target_amount) + '%' }">
               </div>
            </div>

            <div class="flex items-center justify-between pt-4 border-t border-default">
               <div class="flex items-center gap-2 text-muted">
                  <Icon name="lucide:clock" class="w-4 h-4" />
                  <span class="text-xs font-bold">{{ c.days_left }} Hari Lagi</span>
               </div>
               <NuxtLink :to="`/punia/${c.$id}`" 
                         class="bg-brand/10 text-brand px-6 py-2 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-brand hover:text-white transition-all active:scale-95 shadow-sm shadow-brand/10">
                 Beri Dana Punia
               </NuxtLink>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Impact Quote -->
    <div class="px-4 lg:px-0 max-w-5xl mx-auto pt-12">
       <div class="p-8 bg-brand rounded-[3rem] text-white text-center space-y-4 shadow-2xl shadow-brand/20 relative overflow-hidden">
          <Icon name="fa6-solid:om" class="absolute -top-10 -right-10 w-40 h-40 opacity-10 rotate-12" />
          <p class="text-lg font-serif italic leading-relaxed opacity-90 max-w-2xl mx-auto">
             "Dātavyam iti yad dānaṁ dīyate ‘nupakāriṇe, deśe kāle ca pātre ca tad dānaṁ sāttvikaṁ smṛtam."
          </p>
          <div class="h-px w-20 bg-white/30 mx-auto"></div>
          <p class="text-xs font-bold tracking-[0.2em] uppercase">Bhagavad Gita 17.20 — Dana Punia yang Utama</p>
       </div>
    </div>
  </div>
</template>

<style scoped>
.scrollbar-hide::-webkit-scrollbar { display: none; }
.scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
</style>
