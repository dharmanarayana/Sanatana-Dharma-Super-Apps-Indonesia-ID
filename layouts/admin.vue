<template>
  <div class="admin-layout min-h-screen bg-surface">
    <!-- Mobile Header -->
    <header class="lg:hidden flex items-center justify-between p-4 bg-surface border-b border-border sticky top-0 z-50">
      <h1 class="font-bold text-lg text-brand-primary">Admin Panel</h1>
      <div class="flex items-center gap-2">
        <AppNotificationBell />
        <button @click="isSidebarOpen = !isSidebarOpen" class="p-2 text-default hover:bg-surface-variant rounded-lg transition-colors">
          <Icon :name="isSidebarOpen ? 'lucide:x' : 'lucide:menu'" size="24" />
        </button>
      </div>
    </header>

    <div class="flex flex-col lg:flex-row min-h-screen">
      <!-- Sidebar Overlay -->
      <div v-if="isSidebarOpen" 
           @click="isSidebarOpen = false"
           class="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm transition-opacity"></div>

      <!-- Sidebar -->
      <aside :class="[
        'fixed inset-y-0 left-0 w-72 bg-surface border-r border-border z-50 lg:z-0 lg:static transition-transform duration-300 transform',
        isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      ]">
        <div class="h-full flex flex-col p-6">
          <div class="flex items-center gap-3 mb-10 px-2 lg:px-0">
            <div class="w-10 h-10 bg-brand-primary rounded-xl flex items-center justify-center shadow-lg shadow-brand-primary/20">
              <Icon name="lucide:shield-check" class="text-white" size="24" />
            </div>
            <div>
              <h2 class="font-bold text-default">Sanatana Dharma</h2>
              <p class="text-xs text-secondary font-medium uppercase tracking-wider">Administrator</p>
            </div>
          </div>

          <nav class="flex-1 space-y-1 overflow-y-auto custom-scrollbar pr-2">
            <NuxtLink v-for="item in navItems" 
                      :key="item.path"
                      :to="item.path"
                      @click="isSidebarOpen = false"
                      class="flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group relative"
                      :class="[
                        $route.path === item.path 
                          ? 'bg-brand-primary text-white shadow-md shadow-brand-primary/20' 
                          : 'text-secondary hover:text-default hover:bg-surface-variant'
                      ]">
              <Icon :name="item.icon" size="20" :class="[$route.path === item.path ? 'text-white' : 'text-secondary group-hover:text-default transition-colors']" />
              <span class="font-medium">{{ item.label }}</span>
              <div v-if="$route.path === item.path" class="absolute left-0 w-1 h-6 bg-white rounded-full opacity-0"></div>
            </NuxtLink>
          </nav>

          <div class="mt-8 pt-6 border-t border-border">
            <NuxtLink to="/profil" class="flex items-center gap-3 px-4 py-3 w-full text-secondary hover:text-brand-primary hover:bg-brand-primary/5 rounded-xl transition-all duration-200 group">
              <Icon name="lucide:user" size="20" class="group-hover:scale-110 transition-transform" />
              <span class="font-medium">Kembali ke Profil</span>
            </NuxtLink>
          </div>
        </div>
      </aside>

      <!-- Main Content -->
      <main class="flex-1 min-h-0 bg-surface-variant/30">
        <div class="max-w-7xl mx-auto px-4 lg:px-8 py-8 lg:py-12">
          <slot />
        </div>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
const isSidebarOpen = ref(false)

const navItems = [
  { label: 'Dashboard', icon: 'lucide:layout-dashboard', path: '/admin' },
  { label: 'Video', icon: 'lucide:clapperboard', path: '/admin/video' },
  { label: 'E-Library', icon: 'lucide:library', path: '/admin/e-library' },
  { label: 'Berita', icon: 'lucide:newspaper', path: '/admin/berita' },
  { label: 'Donasi', icon: 'lucide:heart', path: '/admin/donasi' },
  { label: 'Direktori Pura', icon: 'lucide:map-pin', path: '/admin/pura' },
  { label: 'Kitab Suci', icon: 'lucide:book', path: '/admin/kitab-suci' },
  { label: 'Tri Sandhya', icon: 'lucide:sun', path: '/admin/tri-sandhya' },
  { label: 'Doa & Mantra', icon: 'lucide:scroll-text', path: '/admin/doa-mantra' },
]

// Close sidebar on route change for safety
watch(() => useRoute().path, () => {
  isSidebarOpen.value = false
})
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 4px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: var(--border-color);
  border-radius: 10px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: var(--text-secondary);
}
</style>
