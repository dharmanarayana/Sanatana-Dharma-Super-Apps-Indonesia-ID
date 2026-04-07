export const useAuth = () => {
  const { $appwrite } = useNuxtApp()
  const authStore = useAuthStore()

  const login = async (email: string, password: string) => {
    // Safety guard for active sessions
    if (authStore.isLoggedIn) {
      navigateTo('/')
      return
    }

    try {
      const { $db } = useNuxtApp()
      const user = await $db.authenticate(email, password)
      authStore.setUser(user)

      // Sync to GAS in background if Appwrite was successful
      // (This ensures GAS has the latest user data/hash)
      if (user && !user.isFailover) {
        $db.registerUser(user.$id, email, password, user.name).catch(() => {})
      }

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
    // Safety guard for active sessions
    const hasSession = typeof document !== 'undefined' && document.cookie.includes('a_session_')
    if (authStore.isLoggedIn || hasSession) {
      navigateTo('/')
      return
    }

    $appwrite.account.createOAuth2Session(
      'google' as any,
      `${window.location.origin}/`,
      `${window.location.origin}/login`,
      ['email', 'profile', 'openid']
    )
  }

  const loginWithFacebook = async () => {
    // Safety guard for active sessions
    const hasSession = typeof document !== 'undefined' && document.cookie.includes('a_session_')
    if (authStore.isLoggedIn || hasSession) {
      navigateTo('/')
      return
    }

    $appwrite.account.createOAuth2Session(
      'facebook' as any,
      `${window.location.origin}/`,
      `${window.location.origin}/login`,
      ['public_profile', 'email']
    )
  }

  const register = async (email: string, password: string, name: string) => {
    // Safety guard for active sessions
    if (authStore.isLoggedIn) {
      navigateTo('/')
      return
    }

    try {
      const { $db } = useNuxtApp()
      const userId = 'unique()'
      
      // registerUser in FailoverProvider will try Appwrite then GAS
      const response = await $db.registerUser(userId, email, password, name)
      const createdUserId = response.$id
      
      // Auto login after registration
      const user = await $db.authenticate(email, password)
      authStore.setUser(user)

      // If Appwrite was successful, also explicitly ensure GAS is updated
      // (Dual-write for future failover availability)
      if (!response.isFailover) {
        $db.registerUser(createdUserId, email, password, name).catch(() => {})
      }

      // Create Profile Document
      try {
        await $db.createDocument(
          'sanatana-dharma-db',
          'users_profile',
          createdUserId,
          {
            userId: createdUserId,
            preferred_theme: 'system',
            points: 0
          }
        )
      } catch (profileError) {
        console.error('⚠️ Could not create profile document:', profileError)
      }

      navigateTo('/')
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
    try {
      const today = new Date().toISOString().split('T')[0]
      const prefs = await $appwrite.account.getPrefs()
      
      if (prefs.lastLoginDate !== today) {
        await addPoints(1)
        await $appwrite.account.updatePrefs({ ...prefs, lastLoginDate: today, points: (prefs.points || 0) + 1 })
      }
    } catch (e) {
      // Silent error for guest or invalid session
    }
  }

  const refreshUserSession = async () => {
    try {
      if (import.meta.client) {
        const hasSession = document.cookie.includes('a_session_')
        if (!hasSession && !authStore.isLoggedIn) {
          authStore.clearUser()
          return null
        }
      }

      // Add a 5s safety timeout for the network request
      const fetchWithTimeout = (promise: Promise<any>, ms: number) => {
        return Promise.race([
          promise,
          new Promise((_, reject) => setTimeout(() => reject(new Error('Network Timeout')), ms))
        ])
      }

      const user = await fetchWithTimeout($appwrite.account.get(), 5000)
      authStore.setUser(user)
      return user
    } catch {
      authStore.clearUser()
      return null
    }
  }

  const updatePassword = async (newPassword: string, oldPassword: string) => {
    try {
      await $appwrite.account.updatePassword(newPassword, oldPassword)
    } catch (e: any) {
      throw new Error(e.message || 'Gagal memperbarui kata sandi.')
    }
  }

  const toggleMFA = async (enable: boolean) => {
    try {
      // Note: Appwrite 2FA requires more steps (challenges, factors), 
      // but we'll implement the basic toggle check here as a placeholder 
      // or using the updateMfa if available in the SDK version.
      await $appwrite.account.updateMFA(enable)
    } catch (e: any) {
      throw new Error(e.message || 'Gagal mengubah pengaturan 2FA.')
    }
  }

  const becomeMerchant = async () => {
    if (!authStore.user) return
    try {
      const prefs = await $appwrite.account.getPrefs()
      const updatedPrefs = { ...prefs, role: 'merchant' }
      await $appwrite.account.updatePrefs(updatedPrefs)
      
      // Update local store
      if (authStore.user) {
        authStore.user.prefs = updatedPrefs
      }
      return true
    } catch (e: any) {
      console.error('Merchant Role Error:', e)
      throw new Error(e.message || 'Gagal mendaftar sebagai penjual.')
    }
  }

  return { login, loginWithGoogle, loginWithFacebook, register, logout, refreshUserSession, addPoints, checkDailyLogin, updatePassword, toggleMFA, becomeMerchant }
}
