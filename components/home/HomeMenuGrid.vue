<template>
  <div class="grid grid-cols-4 gap-3 lg:gap-4 px-1">
    <HomeMenuCard v-for="menu in menus" :key="menu.id" :menu="menu" />
  </div>
</template>

<script setup>
const menus = [
  // BARIS 1 — Peribadatan & Ritual
  { id: 1, label: 'Kalender', icon: 'lucide:calendar', color: 'bg-saffron', path: '/kalender' },
  { id: 2, label: 'Doa', icon: 'lucide:pray', iconComp: 'lucide:scroll-text', color: 'bg-saffron', path: '/doa-mantra' },
  { id: 3, label: 'Kitab', icon: 'lucide:book', color: 'bg-saffron', path: '/kitab-suci' },
  { id: 4, label: 'Alarm', icon: 'lucide:alarm-clock', color: 'bg-saffron', path: '/alarm' },

  // BARIS 2 — Edukasi & Konten
  { id: 5, label: 'Video', icon: 'lucide:clapperboard', color: 'bg-gold', path: '/video' },
  { id: 6, label: 'Library', icon: 'lucide:library', color: 'bg-gold', path: '/e-library' },
  { id: 7, label: 'Berita', icon: 'lucide:newspaper', color: 'bg-gold', path: '/berita' },
  { id: 8, label: 'Donasi', icon: 'lucide:heart', color: 'bg-gold', path: '/donasi' },

  // BARIS 3 — Sosial & Ekonomi
  { id: 9, label: 'Forum', icon: 'lucide:message-square', color: 'bg-maroon', path: '/forum' },
  { id: 10, label: 'Pura', icon: 'lucide:map-pin', color: 'bg-maroon', path: '/pura' },
  { id: 11, label: 'Kelas', icon: 'lucide:graduation-cap', color: 'bg-maroon', path: '/kelas' },
  { id: 12, label: 'Galeri', icon: 'lucide:image', color: 'bg-maroon', path: '/galeri' },

  // BARIS 4 — Marketplace
  { id: 13, label: 'Toko', icon: 'lucide:shopping-bag', color: 'bg-[var(--text-secondary)]', path: '/marketplace' },
  { id: 14, label: 'Sarana', icon: 'lucide:flame', iconComp: 'lucide:sparkles', color: 'bg-[var(--text-secondary)]', path: '/sarana-upacara' },
  { id: 15, label: 'Wisata', icon: 'lucide:plane', color: 'bg-[var(--text-secondary)]', path: '/wisata-rohani' },
  { id: 16, label: 'Lelang', icon: 'lucide:gavel', color: 'bg-[var(--text-secondary)]', path: '/lelang' },
]
</script>
