export default defineNuxtRouteMiddleware(async (to, from) => {
  console.log('--- 📍 Middleware Auth:', to.path)
  const authStore = useAuthStore()
  const { refreshUserSession } = useAuth()

  // Verify session if not already in store
  if (!authStore.isLoggedIn) {
    console.log('--- 🔑 Middleware: Verifying session...')
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
