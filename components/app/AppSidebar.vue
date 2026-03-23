<!-- components/app/AppSidebar.vue -->
<script setup lang="ts">
defineProps<{ collapsed: boolean }>()
defineEmits(['toggle'])

const authStore = useAuthStore()
const route  = useRoute()
const isActive = (path: string) =>
  path === '/' ? route.path === '/' : route.path.startsWith(path)

const navGroups = [
  {
    label: 'Peribadatan & Ritual',
    items: [
      { path: '/',              icon: '🏠', label: 'Beranda' },
      { path: '/kalender',      icon: '🗓️', label: 'Kalender Saka' },
      { path: '/doa-mantra',    icon: '🙏', label: 'Doa & Mantra' },
      { path: '/kitab-suci',    icon: '📖', label: 'Kitab Suci' },
      { path: '/alarm',         icon: '⏰', label: 'Tri Sandhya' },
    ]
  },
  {
    label: 'Edukasi & Konten',
    items: [
      { path: '/video',         icon: '▶️', label: 'Video' },
      { path: '/e-library',     icon: '📚', label: 'E-Library' },
      { path: '/berita',        icon: '📰', label: 'Berita' },
      { path: '/donasi',        icon: '💛', label: 'Donasi' },
    ]
  },
  {
    label: 'Sosial & Ekonomi',
    items: [
      { path: '/forum',         icon: '💬', label: 'Forum' },
      { path: '/pura',          icon: '🗺️', label: 'Direktori Pura' },
      { path: '/wisata-rohani', icon: '🏖️', label: 'Wisata Rohani' },
      { path: '/sarana-upacara',  icon: '🛍️', label: 'Sarana Upacara' },
    ]
  },
]
const firstName = computed(() => {
  return authStore.user?.name?.split(' ')[0] || 'User'
})
</script>

<template>
  <aside
    class="fixed left-0 top-0 bottom-0 z-40 flex flex-col
           bg-surface border-r border-default
           transition-all duration-300 overflow-hidden"
    :class="collapsed ? 'w-[72px]' : 'w-[240px]'"
  >
    <!-- Logo -->
    <div class="flex items-center gap-3 px-4 h-16 border-b border-default shrink-0">
      <span class="text-2xl shrink-0">🕉️</span>
      <Transition name="fade-label">
        <div v-if="!collapsed" class="overflow-hidden">
          <p class="font-serif font-bold text-brand text-base leading-tight">
            Sanatana Dharma
          </p>
          <p class="text-muted text-xs">Digital</p>
        </div>
      </Transition>
    </div>

    <!-- Navigasi scroll -->
    <nav class="flex-1 overflow-y-auto py-4 scrollbar-hide">
      <div v-for="group in navGroups" :key="group.label" class="mb-6">

        <!-- Label grup (sembunyikan saat collapsed) -->
        <template v-if="!collapsed">
          <Transition name="fade-label">
            <p class="text-xs font-bold text-muted uppercase tracking-widest px-4 mb-2">
              {{ group.label }}
            </p>
          </Transition>
        </template>
        <div v-else class="border-t border-default mx-3 mb-3" />

        <!-- Nav items -->
        <NuxtLink
          v-for="item in group.items"
          :key="item.path"
          :to="item.path"
          class="flex items-center gap-3 mx-2 px-3 py-2.5 rounded-xl
                 transition-all duration-150 group relative"
          :class="isActive(item.path)
            ? 'bg-[var(--state-active)] text-brand font-semibold'
            : 'text-secondary hover:bg-[var(--state-hover)] hover:text-default'"
        >
          <span class="text-xl shrink-0 w-7 text-center">{{ item.icon }}</span>

          <Transition name="fade-label">
            <span v-if="!collapsed" class="text-base truncate">
              {{ item.label }}
            </span>
          </Transition>

          <!-- Tooltip saat collapsed -->
          <div v-if="collapsed"
               class="absolute left-full ml-3 px-3 py-1.5 bg-charcoal text-white
                      text-base rounded-lg whitespace-nowrap opacity-0 pointer-events-none
                      group-hover:opacity-100 transition-opacity duration-150 z-50
                      shadow-lg">
            {{ item.label }}
          </div>

          <!-- Active dot -->
          <div v-if="isActive(item.path) && !collapsed"
               class="ml-auto w-1.5 h-1.5 rounded-full bg-brand shrink-0" />
        </NuxtLink>

      </div>
    </nav>

    <!-- Footer sidebar: profil + collapse toggle -->
    <div class="border-t border-default p-3 shrink-0 space-y-1">
      <template v-if="authStore.isLoggedIn">
        <NuxtLink to="/profil"
          class="flex items-center gap-3 px-3 py-2.5 rounded-xl
                 hover:bg-[var(--state-hover)] transition-colors group relative">
          <div class="w-7 h-7 rounded-full bg-brand
                      flex items-center justify-center shrink-0">
            <span class="text-xs">👤</span>
          </div>
          <Transition name="fade-label">
            <span v-if="!collapsed" class="text-base text-brand font-bold">Hai, {{ firstName }}!</span>
          </Transition>
          <!-- Tooltip saat collapsed -->
          <div v-if="collapsed"
               class="absolute left-full ml-3 px-3 py-1.5 bg-charcoal text-white
                      text-sm rounded-lg whitespace-nowrap opacity-0 pointer-events-none
                      group-hover:opacity-100 transition-opacity duration-150 z-50
                      shadow-lg">
            Profil Saya
          </div>
        </NuxtLink>
      </template>
      <template v-else>
        <NuxtLink to="/login"
          class="flex items-center gap-3 px-3 py-2.5 rounded-xl
                 hover:bg-brand/10 text-brand-maroon transition-colors group relative">
          <div class="w-7 h-7 rounded-full bg-brand/10
                      flex items-center justify-center shrink-0">
            <span class="text-sm">🔑</span>
          </div>
          <Transition name="fade-label">
            <span v-if="!collapsed" class="text-base font-bold">Masuk / Daftar</span>
          </Transition>
          <!-- Tooltip saat collapsed -->
          <div v-if="collapsed"
               class="absolute left-full ml-3 px-3 py-1.5 bg-charcoal text-white
                      text-sm rounded-lg whitespace-nowrap opacity-0 pointer-events-none
                      group-hover:opacity-100 transition-opacity duration-150 z-50
                      shadow-lg">
            Masuk / Daftar
          </div>
        </NuxtLink>
      </template>

      <!-- Toggle collapse -->
      <button
        @click="$emit('toggle')"
        class="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl
               hover:bg-[var(--state-hover)] transition-colors text-muted"
        :aria-label="collapsed ? 'Perluas sidebar' : 'Ciutkan sidebar'"
      >
        <span class="text-xl w-7 text-center">
          {{ collapsed ? '▶' : '◀' }}
        </span>
        <Transition name="fade-label">
          <span v-if="!collapsed" class="text-base">Ciutkan</span>
        </Transition>
      </button>
    </div>
  </aside>
</template>

<style scoped>
.fade-label-enter-active,
.fade-label-leave-active { transition: opacity 150ms ease, width 150ms ease; }
.fade-label-enter-from,
.fade-label-leave-to     { opacity: 0; width: 0; }
</style>
