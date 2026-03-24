<template>
  <div>
    <AppSplashScreen :show="showSplash" />
    <NuxtLoadingIndicator color="var(--brand-primary)" />
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
    <AppSocialPopup />
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