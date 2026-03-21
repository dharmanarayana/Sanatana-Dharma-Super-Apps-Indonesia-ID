<template>
  <div class="space-y-4">
    <div v-for="group in menuGroups" :key="group.title">
      <!-- Judul baris — hanya tampil di mobile -->
      <h3 class="lg:hidden text-xs font-semibold uppercase tracking-wider text-muted mb-2 px-1">
        {{ group.title }}
      </h3>
      <div class="grid grid-cols-3 gap-3 lg:gap-4 px-1">
        <HomeMenuCard v-for="menu in group.items" :key="menu.id" :menu="menu" />
      </div>
    </div>
  </div>
</template>

<script setup>
const menuGroups = [
  {
    title: 'Peribadatan & Ritual',
    items: [
      { id: 1, label: 'Kalender', icon: 'lucide:calendar', color: 'bg-saffron', path: '/kalender' },
      { id: 2, label: 'Doa', icon: 'lucide:pray', iconComp: 'lucide:scroll-text', color: 'bg-saffron', path: '/doa-mantra' },
      { id: 3, label: 'Kitab', icon: 'lucide:book', color: 'bg-saffron', path: '/kitab-suci' },
    ]
  },
  {
    title: 'Edukasi & Konten',
    items: [
      { id: 4, label: 'Video', icon: 'lucide:clapperboard', color: 'bg-gold', path: '/video' },
      { id: 5, label: 'Library', icon: 'lucide:library', color: 'bg-gold', path: '/e-library' },
      { id: 6, label: 'Berita', icon: 'lucide:newspaper', color: 'bg-gold', path: '/berita' },
    ]
  },
  {
    title: 'Sosial & Komunitas',
    items: [
      { id: 7, label: 'Forum', icon: 'lucide:message-square', color: 'bg-maroon', path: '/forum' },
      { id: 8, label: 'Pura', icon: 'lucide:map-pin', color: 'bg-maroon', path: '/pura' },
      { id: 9, label: 'Donasi', icon: 'lucide:heart', color: 'bg-maroon', path: '/donasi' },
    ]
  },
  {
    title: 'Fitur Tambahan',
    items: [
      { id: 10, label: 'Kelas', icon: 'lucide:graduation-cap', color: 'bg-gold', path: '/kelas' },
      { id: 11, label: 'Galeri', icon: 'lucide:image', color: 'bg-gold', path: '/galeri' },
      { id: 12, label: 'Alarm', icon: 'lucide:alarm-clock', color: 'bg-gold', path: '/alarm' },
    ]
  },
  {
    title: 'Marketplace',
    items: [
      { id: 13, label: 'Toko', icon: 'lucide:shopping-bag', color: 'bg-saffron', path: '/marketplace' },
      { id: 14, label: 'Sarana', icon: 'lucide:flame', iconComp: 'lucide:sparkles', color: 'bg-saffron', path: '/sarana-upacara' },
      { id: 15, label: 'Wisata', icon: 'lucide:plane', color: 'bg-saffron', path: '/wisata-rohani' },
    ]
  },
  {
    title: 'Lainnya',
    items: [
      { id: 16, label: 'Lelang', icon: 'lucide:gavel', color: 'bg-maroon', path: '/lelang' },
    ]
  },
]
</script>
