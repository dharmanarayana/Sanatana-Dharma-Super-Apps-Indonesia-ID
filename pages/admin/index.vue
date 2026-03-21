<template>
  <div class="space-y-8">
    <div class="flex flex-col md:flex-row md:items-end justify-between gap-4">
      <div>
        <h1 class="text-3xl font-bold text-default mb-2">Pusat Kendali Admin</h1>
        <p class="text-secondary text-lg">Kelola konten Sanatana Dharma dengan mudah dan efisien.</p>
      </div>
      <div class="px-4 py-2 bg-brand-primary/10 rounded-full border border-brand-primary/20">
        <span class="text-brand-primary font-semibold text-sm">Versi 1.0.0</span>
      </div>
    </div>

    <!-- Stats Overview -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <div v-for="stat in stats" :key="stat.label" 
           class="bg-surface p-6 rounded-2xl border border-border hover:border-brand-primary/30 transition-all group">
        <div class="flex items-center gap-4">
          <div :class="[stat.color, 'w-12 h-12 rounded-xl flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform']">
            <Icon :name="stat.icon" size="24" />
          </div>
          <div>
            <p class="text-sm font-medium text-secondary">{{ stat.label }}</p>
            <h3 class="text-2xl font-bold text-default">{{ stat.value }}</h3>
          </div>
        </div>
      </div>
    </div>

    <!-- CRUD Navigation -->
    <div>
      <h2 class="text-xl font-bold text-default mb-6 flex items-center gap-2">
        <Icon name="lucide:layers" class="text-brand-primary" />
        Modul Konten
      </h2>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <NuxtLink v-for="module in modules" :key="module.path" 
                  :to="module.path"
                  class="bg-surface p-6 rounded-2xl border border-border hover:border-brand-primary hover:shadow-xl hover:shadow-brand-primary/5 transition-all group">
          <div class="flex items-start justify-between mb-4">
            <div :class="[module.color, 'p-3 rounded-xl text-white group-hover:rotate-12 transition-transform']">
              <Icon :name="module.icon" size="24" />
            </div>
            <Icon name="lucide:arrow-right" class="text-secondary group-hover:text-brand-primary group-hover:translate-x-1 transition-all" size="20" />
          </div>
          <h3 class="font-bold text-default text-lg mb-2">{{ module.label }}</h3>
          <p class="text-secondary text-sm leading-relaxed">{{ module.description }}</p>
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'admin',
  middleware: 'admin'
})

const stats = [
  { label: 'Total Video', value: '124', icon: 'lucide:video', color: 'bg-blue-500' },
  { label: 'E-Library Item', value: '89', icon: 'lucide:library', color: 'bg-purple-500' },
  { label: 'Berita Aktif', value: '45', icon: 'lucide:newspaper', color: 'bg-green-500' },
  { label: 'Donasi Aktif', value: '12', icon: 'lucide:heart', color: 'bg-pink-500' },
]

const modules = [
  { 
    label: 'Video', 
    description: 'Kelola konten video edukasi, ceramah, dan dokumentasi ritual.', 
    icon: 'lucide:clapperboard', 
    path: '/admin/video',
    color: 'bg-saffron'
  },
  { 
    label: 'E-Library', 
    description: 'Upload dan kelola buku elektronik, PDF, dan dokumen literasi.', 
    icon: 'lucide:library', 
    path: '/admin/e-library',
    color: 'bg-saffron'
  },
  { 
    label: 'Berita', 
    description: 'Tulis dan publikasi berita terkini seputar umat dan pura.', 
    icon: 'lucide:newspaper', 
    path: '/admin/berita',
    color: 'bg-gold'
  },
  { 
    label: 'Donasi', 
    description: 'Kelola kampanye donasi, target dana, dan laporan masuk.', 
    icon: 'lucide:heart', 
    path: '/admin/donasi',
    color: 'bg-gold'
  },
  { 
    label: 'Direktori Pura', 
    description: 'Database pura di seluruh Indonesia dengan peta & sejarah.', 
    icon: 'lucide:map-pin', 
    path: '/admin/pura',
    color: 'bg-maroon'
  },
  { 
    label: 'Kitab Suci', 
    description: 'Input dan edit teks suci Weda, Upanisad, dan kitab lainnya.', 
    icon: 'lucide:book', 
    path: '/admin/kitab-suci',
    color: 'bg-maroon'
  },
  { 
    label: 'Tri Sandhya', 
    description: 'Kelola teks, audio, dan terjemahan bait-bait Tri Sandhya.', 
    icon: 'lucide:sun', 
    path: '/admin/tri-sandhya',
    color: 'bg-indigo-600'
  },
  { 
    label: 'Doa & Mantra', 
    description: 'Kumpulan doa harian, mantra pemujaan, dan mp3 audio.', 
    icon: 'lucide:scroll-text', 
    path: '/admin/doa-mantra',
    color: 'bg-indigo-600'
  },
]
</script>
