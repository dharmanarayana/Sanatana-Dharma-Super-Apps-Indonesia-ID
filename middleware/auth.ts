export default defineNuxtRouteMiddleware(async (to, from) => {
  if (import.meta.server) return
  
  const authStore = useAuthStore()
  const { refreshUserSession } = useAuth()

  // Verify session if not already in store
  if (!authStore.isLoggedIn) {
    await refreshUserSession()
  }

  // Redirect to login if still not logged in
  if (!authStore.isLoggedIn && to.path !== '/login' && to.path !== '/register') {
    return navigateTo('/login')
  }

  // Redirect to home if already logged in and trying to access login/register
  if (authStore.isLoggedIn && (to.path === '/login' || to.path === '/register')) {
    return navigateTo('/')
  }
})
