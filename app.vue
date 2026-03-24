<template>
  <div>
    <AppSplashScreen :show="showSplash" />
    <NuxtLoadingIndicator color="var(--brand-primary)" />
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
    <AppSocialPopup />

    <!-- PWA Update Notification -->
    <div v-if="$pwa?.needRefresh" 
         class="fixed bottom-24 left-4 right-4 z-[100] bg-surface/90 backdrop-blur-xl border border-brand/20 p-4 rounded-2xl shadow-2xl flex items-center justify-between animate-fade-up">
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 bg-brand/10 rounded-full flex items-center justify-center text-brand">
          <Icon name="lucide:refresh-cw" size="20" />
        </div>
        <div>
          <p class="text-xs font-bold text-default">Update Tersedia!</p>
          <p class="text-[10px] text-muted">Aplikasi versi terbaru siap digunakan.</p>
        </div>
      </div>
      <button @click="$pwa.updateServiceWorker()" 
              class="bg-brand text-inverse px-4 py-2 rounded-xl text-xs font-bold active:scale-95 transition-all">
        Update
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
const { refreshUserSession, checkDailyLogin } = useAuth()
const showSplash = ref(true)

useSeoMeta({
  title: 'Sanatana Dharma Digital',
  ogTitle: 'Sanatana Dharma Digital',
  description: 'Platform Keagamaan Hindu Indonesia — Kalender Saka, Doa Mantra, Kitab Suci, dan lebih banyak lagi',
  ogDescription: 'Platform Keagamaan Hindu Indonesia — Kalender Saka, Doa Mantra, Kitab Suci, dan lebih banyak lagi',
  ogImage: '/og-image.png',
  twitterCard: 'summary_large_image',
})

// Safety timeout for splash screen: hide after 4s regardless of mounting
// This fixes hangs in offline mode where Nuxt Suspense might wait forever.
if (import.meta.client) {
  setTimeout(() => {
    if (showSplash.value) {
      console.warn('Splash screen safety dismissal triggered.')
      showSplash.value = false
    }
  }, 4000)
}

onMounted(async () => {
  // Apply accent theme
  const { applyTheme } = useTheme()
  applyTheme()

  // Check session and daily login points without blocking splash hide
  refreshUserSession()
  checkDailyLogin()
  
  // Normal hide with a slight delay
  setTimeout(() => {
    showSplash.value = false
  }, 1200)
})
</script>

<style>
/* Page transitions only - avoid universal transitions for better performance */
.page-enter-active,
.page-leave-active {
  transition: opacity 0.2s, filter 0.2s;
}
.page-enter-from,
.page-leave-to {
  opacity: 0;
  filter: blur(1rem);
}
</style>