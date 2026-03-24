<!-- layouts/default.vue -->
<script setup lang="ts">
import { useNetwork } from '@vueuse/core'

const { isDesktop } = useDevice()
const sidebarCollapsed = ref(false)
const { isOnline } = useNetwork()
const route = useRoute()

// Define routes that ARE supported offline
const offlineSupportedPrefixes = [
  '/doa-mantra',
  '/kitab-suci',
  '/berita',
  '/kalender',
  '/saved',
  '/japa-mala',
  '/ala-ayuning-dewasa'
]

const showOfflineFallback = computed(() => {
  // If online, never show fallback
  if (isOnline.value === true) return false
  
  // If home page, it is supported
  if (route.path === '/') return false
  
  // Check if current path matches any supported prefix
  const isSupported = offlineSupportedPrefixes.some(prefix => route.path.startsWith(prefix))
  
  return !isSupported
})
</script>

<template>
  <div class="min-h-screen bg-base text-default transition-colors duration-300">

    <!-- ══════════════════════════════ -->
    <!--   DESKTOP LAYOUT (≥ 1024px)   -->
    <!-- ══════════════════════════════ -->
    <template v-if="isDesktop">

      <!-- Sidebar navigasi kiri -->
      <AppSidebar :collapsed="sidebarCollapsed"
                  @toggle="sidebarCollapsed = !sidebarCollapsed" />

      <!-- Area konten -->
      <div class="transition-all duration-300"
           :style="{ marginLeft: sidebarCollapsed ? '72px' : '240px' }">

        <AppHeaderDesktop @toggle-sidebar="sidebarCollapsed = !sidebarCollapsed" />

        <main class="min-h-screen">
          <div class="px-4 lg:px-8 pt-4 pb-8 w-full max-w-[1600px] mx-auto">
            <slot />
          </div>
        </main>

      </div>
    </template>

    <!-- ══════════════════════════════ -->
    <!--   MOBILE LAYOUT  (< 1024px)   -->
    <!-- ══════════════════════════════ -->
    <template v-else>
      <AppHeaderMobile />

      <main class="pt-[60px] pb-nav">
        <slot />
      </main>

      <AppBottomNav />
    </template>
    
    <AppGlobalSearch />
    <AppOfflineBanner />
    <AppOfflineFallback v-if="showOfflineFallback" />
  </div>
</template>
