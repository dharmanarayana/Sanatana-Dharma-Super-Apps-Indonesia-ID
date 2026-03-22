<template>
  <div>
    <NuxtLoadingIndicator color="var(--brand-primary)" />
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>

<script setup lang="ts">
const { refreshUserSession, checkDailyLogin } = useAuth()

onMounted(async () => {
  console.log('--- 🚀 App: onMounted start ---')
  document.documentElement.style.visibility = 'visible'
  
  // Check session and daily login points
  await refreshUserSession()
  await checkDailyLogin()
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