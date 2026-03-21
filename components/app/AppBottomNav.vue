<!-- components/app/AppBottomNav.vue -->
<script setup lang="ts">
const authStore = useAuthStore()
const route = useRoute()
const isActive = (path: string) =>
  path === '/' ? route.path === '/' : route.path.startsWith(path)

const tabs = computed(() => [
  { path: '/',           icon: 'lucide:house',             label: 'Beranda'  },
  { path: '/kalender',   icon: 'lucide:calendar-days',     label: 'Kalender' },
  { path: '/kitab-suci', icon: 'lucide:book-open-text',    label: 'Kitab'    },
  { path: '/forum',      icon: 'lucide:message-square',    label: 'Sosial'   },
  { 
    path: authStore.isLoggedIn ? '/profil' : '/login', 
    icon: 'lucide:user', 
    label: authStore.isLoggedIn ? 'Profil' : 'Masuk' 
  },
])
</script>

<template>
  <nav class="app-bottom-nav lg:hidden fixed bottom-0 left-0 right-0 z-40
              flex items-center justify-around safe-bottom bg-surface border-t border-default"
       style="height: var(--bottom-nav-h)">
    <NuxtLink
      v-for="tab in tabs.slice(0, 4)" :key="tab.path" :to="tab.path"
      class="flex flex-col items-center justify-center gap-0.5
             flex-1 h-full rounded-none transition-colors duration-150"
      :class="isActive(tab.path)
        ? 'text-brand font-semibold'
        : 'text-muted'"
      :aria-label="tab.label"
    >
      <Icon :name="tab.icon" class="w-6 h-6 transition-transform duration-200"
            :class="isActive(tab.path) ? 'scale-110' : ''" />
      <span class="text-[11px] font-medium leading-tight mt-0.5">{{ tab.label }}</span>
      <div class="h-0.5 w-5 rounded-full transition-all duration-150 mt-1"
           :class="isActive(tab.path) ? 'bg-brand' : 'bg-transparent'" />
    </NuxtLink>

    <!-- ClientOnly for Profile/Login to avoid hydration mismatch -->
    <ClientOnly>
      <NuxtLink
        :to="tabs[4].path"
        class="flex flex-col items-center justify-center gap-0.5
               flex-1 h-full rounded-none transition-colors duration-150"
        :class="isActive(tabs[4].path)
          ? 'text-brand font-semibold'
          : 'text-muted'"
        :aria-label="tabs[4].label"
      >
        <Icon :name="tabs[4].icon" class="w-6 h-6 transition-transform duration-200"
              :class="isActive(tabs[4].path) ? 'scale-110' : ''" />
        <span class="text-[11px] font-medium leading-tight mt-0.5">{{ tabs[4].label }}</span>
        <div class="h-0.5 w-5 rounded-full transition-all duration-150 mt-1"
             :class="isActive(tabs[4].path) ? 'bg-brand' : 'bg-transparent'" />
      </NuxtLink>
      <template #fallback>
        <div class="flex flex-col items-center justify-center gap-0.5 flex-1 h-full text-muted opacity-50">
          <Icon name="lucide:user" class="w-6 h-6" />
          <span class="text-[11px] font-medium leading-tight mt-0.5">...</span>
        </div>
      </template>
    </ClientOnly>
  </nav>
</template>
