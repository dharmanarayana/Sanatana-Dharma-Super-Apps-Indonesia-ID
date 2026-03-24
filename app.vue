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

onMounted(async () => {
  // Check session and daily login points
  await refreshUserSession()
  await checkDailyLogin()
  
  // Hide splash screen with a slight delay for better UX
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