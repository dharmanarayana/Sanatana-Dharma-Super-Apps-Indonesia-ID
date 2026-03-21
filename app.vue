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
/* Transisi warna halus saat tema berganti — terapkan ke semua elemen */
*, *::before, *::after {
  transition-property: background-color, border-color, color, fill, stroke;
  transition-duration: 200ms;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
}

/* Kecualikan elemen animasi agar tidak terganggu transisi tema */
.no-theme-transition,
.no-theme-transition * {
  transition: none !important;
}

.page-enter-active,
.page-leave-active {
  transition: all 0.2s;
}
.page-enter-from,
.page-leave-to {
  opacity: 0;
  filter: blur(1rem);
}
</style>