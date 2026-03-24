export default defineNuxtRouteMiddleware(async (to, from) => {
  if (import.meta.server) return
  
  const authStore = useAuthStore()
  const { refreshUserSession } = useAuth()

  // Verify session if not already in store
  if (!authStore.isLoggedIn) {
    await refreshUserSession()
  }

  // Redirect to login if not logged in
  if (!authStore.isLoggedIn) {
    return navigateTo('/login')
  }

  // Redirect to home if not a merchant
  if (!authStore.isMerchant && !authStore.isAdmin) {
    console.warn('🚫 Merchant access denied for:', authStore.user?.email || 'Guest')
    return navigateTo('/sarana-upacara')
  }
})
