export default defineNuxtRouteMiddleware(async (to, from) => {
  const authStore = useAuthStore()
  const { refreshUserSession } = useAuth()

  // Ensure session is loaded
  if (!authStore.isLoggedIn) {
    await refreshUserSession()
  }

  // Check if admin
  if (!authStore.isAdmin) {
    console.warn('🚫 Admin access denied for:', authStore.user?.email || 'Guest')
    return navigateTo('/')
  }
})
