<template>
  <div class="space-y-6">
    <!-- ═══ HEADER (Pusaka Style) ═══ -->
    <div class="text-center relative py-2">
      <h2 class="text-lg font-bold text-default tracking-tight">Layanan Sanatana</h2>
      <div class="absolute bottom-0 left-1/2 -translate-x-1/2 w-12 h-1.5 bg-brand rounded-full"></div>
    </div>

    <!-- ═══ TAB SWITCHER ═══ -->
    <div class="flex items-center justify-center gap-1 bg-surface/50 p-1 rounded-full border border-default/50 mx-4 overflow-x-auto scrollbar-hide no-wrap">
      <button v-for="group in menuGroups" 
              :key="group.title"
              @click="activeTab = group.title"
              class="px-4 py-2 rounded-full text-xs font-bold transition-all whitespace-nowrap whitespace-pre"
              :class="activeTab === group.title 
                ? 'bg-white shadow-sm text-brand border border-default ring-1 ring-black/5' 
                : 'text-muted/70 hover:text-muted'"
      >
        {{ group.shortTitle || group.title }}
      </button>
    </div>

    <!-- ═══ GRID (Filtered by Tab) ═══ -->
    <div class="px-2">
      <div v-if="activeGroup" class="grid grid-cols-4 gap-4 lg:gap-6">
        <HomeMenuCard v-for="menu in activeGroup.items" :key="menu.id" :menu="menu" />
      </div>
    </div>
  </div>
</template>

<script setup>
const activeTab = ref('Favorit')

const menuGroups = [
  {
    title: 'Favorit',
    shortTitle: 'Favorit',
      items: [
        { id: 1, label: 'Kalender', icon: 'lucide:calendar', color: 'bg-[#5C7CFA]', path: '/kalender' },
        { id: 2, label: 'Doa', icon: 'lucide:scroll-text', color: 'bg-[#40C057]', path: '/doa-mantra' },
        { id: 3, label: 'Kitab Suci', icon: 'lucide:book-open', color: 'bg-[#7048E8]', path: '/kitab-suci' },
        { id: 14, label: 'Toko', icon: 'lucide:shopping-bag', color: 'bg-[#FF922B]', path: '/marketplace' },
        { id: 15, label: 'Sarana', icon: 'lucide:sparkles', color: 'bg-brand', path: '/sarana-upacara' },
        { id: 4, label: 'Video', icon: 'lucide:clapperboard', color: 'bg-[#FCC419]', path: '/video' },
        { id: 8, label: 'Pura', icon: 'lucide:map-pin', color: 'bg-[#37B24D]', path: '/pura' },
        { id: 9, label: 'Donasi', icon: 'lucide:heart', color: 'bg-[#FA5252]', path: '/donasi' },
      ]
  },
  {
    title: 'Keagamaan',
    shortTitle: 'Keagamaan',
    items: [
      { id: 2, label: 'Doa', icon: 'lucide:scroll-text', color: 'bg-saffron', path: '/doa-mantra' },
      { id: 3, label: 'Kitab', icon: 'lucide:book', color: 'bg-saffron', path: '/kitab-suci' },
      { id: 14, label: 'Sarana', icon: 'lucide:sparkles', color: 'bg-saffron', path: '/sarana-upacara' },
      { id: 13, label: 'Toko', icon: 'lucide:shopping-bag', color: 'bg-saffron', path: '/marketplace' },
    ]
  },
  {
    title: 'Pendidikan',
    shortTitle: 'Pendidikan',
    items: [
      { id: 10, label: 'Kelas', icon: 'lucide:graduation-cap', color: 'bg-gold', path: '/kelas' },
      { id: 4, label: 'Video', icon: 'lucide:clapperboard', color: 'bg-gold', path: '/video' },
      { id: 5, label: 'Library', icon: 'lucide:library', color: 'bg-gold', path: '/e-library' },
      { id: 11, label: 'Galeri', icon: 'lucide:image', color: 'bg-gold', path: '/galeri' },
    ]
  },
]

const activeGroup = computed(() => menuGroups.find(g => g.title === activeTab.value))
</script>
