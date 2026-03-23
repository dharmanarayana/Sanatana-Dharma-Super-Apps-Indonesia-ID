<!-- components/app/AppBreadcrumb.vue -->
<script setup lang="ts">
const route = useRoute()

const crumbMap: Record<string, string> = {
  '':            'Beranda',
  'kalender':    'Kalender Saka',
  'doa-mantra':  'Doa & Mantra',
  'kitab-suci':  'Kitab Suci',
  'alarm':       'Tri Sandhya',
  'video':       'Video Pembelajaran',
  'e-library':   'E-Library',
  'berita':      'Berita',
  'donasi':      'Donasi',
  'forum':       'Forum',
  'pura':        'Direktori Pura',
  'wisata-rohani': 'Wisata Rohani',
  'sarana-upacara': 'Sarana Upacara',
  'kelas':       'Kelas Pasraman',
  'galeri':      'Galeri & Event',
  'lelang':      'Lelang Punia',
  'marketplace': 'Marketplace',
  'profil':      'Profil',
}

const { overrides } = useBreadcrumbs()

const prettify = (str: string) => {
  return str.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
}

const crumbs = computed(() => {
  const parts = route.path.split('/').filter(Boolean)
  return [
    { label: 'Beranda', path: '/' },
    ...parts.map((part, i) => ({
      label: overrides.value[part] || crumbMap[part] || prettify(part),
      path: '/' + parts.slice(0, i + 1).join('/')
    }))
  ]
})
</script>

<template>
  <nav aria-label="Breadcrumb" class="flex items-center gap-1.5 text-sm">
    <template v-for="(crumb, i) in crumbs" :key="crumb.path">
      <NuxtLink v-if="i < crumbs.length - 1"
                :to="crumb.path"
                class="text-muted hover:text-brand transition-colors">
        {{ crumb.label }}
      </NuxtLink>
      <span v-else class="text-default font-semibold">{{ crumb.label }}</span>
      <span v-if="i < crumbs.length - 1" class="text-muted">›</span>
    </template>
  </nav>
</template>
