export default defineNuxtPlugin((nuxtApp) => {
  // Wait for Pinia to be ready
  nuxtApp.hook('app:mounted', () => {
    const authStore = useAuthStore()
    const { loadTheme } = useThemeSync()

    // Sync theme on login
    watch(() => authStore.isLoggedIn, (isLoggedIn) => {
      if (isLoggedIn) {
        loadTheme()
      }
    }, { immediate: true })
  })
})
