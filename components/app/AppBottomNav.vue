<!-- components/app/AppBottomNav.vue -->
<script setup lang="ts">
import { ref, computed } from 'vue'
const authStore = useAuthStore()
const route = useRoute()
const isActive = (path: string) =>
  path === '/' ? route.path === '/' : route.path.startsWith(path)

const showMenu = ref(false)
const toggleMenu = () => {
  showMenu.value = !showMenu.value
}

const navItems = computed(() => [
  { path: '/',           icon: 'lucide:house',           label: 'nav.home'  },
  { path: '/kalender',   icon: 'lucide:calendar-days',   label: 'nav.kalender' },
  { type: 'menu',        label: 'nav.menu' },
  { path: '/kitab-suci', icon: 'lucide:book-open-text',  label: 'nav.kitab_suci' },
  { path: '/forum',      icon: 'lucide:message-square',  label: 'nav.forum' },
])
</script>

<template>
  <div>
    <ClientOnly>
      <AppMenuOverlay :show="showMenu" @close="showMenu = false" />
    </ClientOnly>
    
    <nav class="app-bottom-nav lg:hidden fixed bottom-5 left-4 right-4 z-40
                flex items-center safe-bottom bg-surface/90 backdrop-blur-lg 
                border border-white/20 rounded-[32px] shadow-[0_8px_32px_rgba(0,0,0,0.12)] h-[76px] px-2"
    >
      <template v-for="item in navItems" :key="item.label">
        <!-- Regular Tab -->
        <NuxtLink
          v-if="item.path"
          :to="item.path"
          class="flex-1 flex flex-col items-center justify-center gap-1 transition-all duration-300"
          :class="isActive(item.path) ? 'text-brand' : 'text-muted/60'"
        >
          <Icon :name="item.icon!" class="w-6 h-6" :class="isActive(item.path) ? 'scale-110' : ''" />
          <span class="text-[10px] font-bold whitespace-nowrap">{{ $t(item.label) }}</span>
        </NuxtLink>

        <!-- Center MENU FAB -->
        <div v-else class="flex-1 flex flex-col items-center justify-center pt-2">
          <div class="relative w-12 h-6 flex justify-center">
            <button @click="toggleMenu"
                    class="absolute -top-7 w-14 h-14 rounded-full bg-white shadow-lg shadow-brand/20 border-4 border-surface 
                           flex items-center justify-center active:scale-95 transition-all group duration-300 flex-shrink-0 aspect-square"
                    :class="showMenu ? 'rotate-45' : ''">
              <Icon :name="showMenu ? 'lucide:plus' : 'lucide:layout-grid'" 
                    class="w-8 h-8 text-brand transition-all duration-300" />
            </button>
          </div>
          <span class="text-[10px] font-extrabold text-brand mt-2 transition-opacity" 
                :class="showMenu ? 'opacity-0' : 'opacity-100'">
            {{ $t('nav.menu') }}
          </span>
        </div>
      </template>
    </nav>
  </div>
</template>
<!-- Force rebuild to fix hydration mismatch -->
