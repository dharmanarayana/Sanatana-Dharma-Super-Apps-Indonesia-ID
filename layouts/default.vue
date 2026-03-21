<!-- layouts/default.vue -->
<script setup lang="ts">
const { isDesktop } = useDevice()
const sidebarCollapsed = ref(false)
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

      <!-- Area konten (bergeser kanan sesuai sidebar) -->
      <div class="transition-all duration-300"
           :style="{ marginLeft: sidebarCollapsed ? '72px' : '240px' }">

        <!-- Header desktop -->
        <AppHeaderDesktop @toggle-sidebar="sidebarCollapsed = !sidebarCollapsed" />

        <!-- Konten halaman -->
        <main class="min-h-screen">
          <div class="px-4 lg:px-8 pt-4 pb-8 w-full max-w-[1600px] mx-auto transition-all duration-300">
            <slot />
          </div>
        </main>

      </div>
    </template>

    <!-- ══════════════════════════════ -->
    <!--   MOBILE LAYOUT  (< 1024px)   -->
    <!-- ══════════════════════════════ -->
    <template v-else>

      <!-- Header mobile -->
      <AppHeaderMobile />

      <!-- Konten halaman -->
      <main class="pt-[60px] pb-nav">
        <slot />
      </main>

      <!-- Bottom navigation -->
      <AppBottomNav />

    </template>

  </div>
</template>
