export const useAuth = () => {
  const { $appwrite } = useNuxtApp()
  const authStore = useAuthStore()

  const login = async (email: string, password: string) => {
    try {
      console.log('--- 🔐 Attempting Login:', email)
      await $appwrite.account.createEmailPasswordSession(email, password)
      const user = await $appwrite.account.get()
      authStore.setUser(user)
      navigateTo('/')
    } catch (e: any) {
      console.error('--- ❌ Login Error Details:', e)
      
      // Provide more helpful error messages for common Appwrite/Fetch issues
      if (e.message.includes('Failed to fetch')) {
        throw new Error('Gagal menghubungkan ke server (Failed to fetch). Pastikan koneksi internet stabil dan endpoint Appwrite sudah benar di .env.')
      } else if (e.message.includes('Network Error')) {
        throw new Error('Kesalahan Jaringan. Periksa koneksi internet Anda.')
      }
      
      throw new Error(e.message || 'Terjadi kesalahan saat masuk. Silakan coba lagi.')
    }
  }

  const loginWithGoogle = async () => {
    $appwrite.account.createOAuth2Session(
      'google',
      `${window.location.origin}/`,
      `${window.location.origin}/login`
    )
  }

  const register = async (email: string, password: string, name: string) => {
    try {
      await $appwrite.account.create('unique()', email, password, name)
      await login(email, password)
    } catch (e: any) {
      throw new Error(e.message)
    }
  }

  const logout = async () => {
    await $appwrite.account.deleteSession('current')
    authStore.clearUser()
    navigateTo('/login')
  }

  const addPoints = async (amount: number) => {
    if (!authStore.user) return
    try {
      const prefs = await $appwrite.account.getPrefs()
      const currentPoints = Number(prefs.points || 0) + amount
      const updatedPrefs = { ...prefs, points: currentPoints }
      await $appwrite.account.updatePrefs(updatedPrefs)
      
      // Update local store as well
      if (authStore.user) {
        authStore.user.prefs = updatedPrefs
      }
    } catch (e) {
      console.error('Points Error:', e)
    }
  }

  const checkDailyLogin = async () => {
    if (!authStore.user) return
    const today = new Date().toISOString().split('T')[0]
    const prefs = await $appwrite.account.getPrefs()
    
    if (prefs.lastLoginDate !== today) {
      await addPoints(1)
      await $appwrite.account.updatePrefs({ ...prefs, lastLoginDate: today, points: (prefs.points || 0) + 1 })
      console.log('Daily login point rewarded! ☀️')
    }
  }

  const refreshUserSession = async () => {
    try {
      const user = await $appwrite.account.get()
      authStore.setUser(user)
      return user
    } catch {
      authStore.clearUser()
      return null
    }
  }

  return { login, loginWithGoogle, register, logout, refreshUserSession, addPoints, checkDailyLogin }
}
