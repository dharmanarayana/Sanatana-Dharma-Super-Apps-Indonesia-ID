export const useThemeSync = () => {
  const { $appwrite } = useNuxtApp()
  const colorMode    = useColorMode()
  const authStore    = useAuthStore()

  const config = useRuntimeConfig()
  const DB_ID   = config.public.appwriteDatabaseId || 'sanatana-dharma-db'
  const COLL_ID = 'users_profile'

  // Simpan tema ke Appwrite saat user ganti tema
  const saveTheme = async (theme: string) => {
    if (!authStore.user) return  // skip jika belum login
    try {
      await $appwrite.databases.updateDocument(
        DB_ID, COLL_ID, authStore.user.$id,
        { preferred_theme: theme }
      )
    } catch (e) {
      console.warn('Gagal simpan preferensi tema:', e)
    }
  }

  // Muat tema dari Appwrite saat login
  const loadTheme = async () => {
    if (!authStore.user) return
    try {
      const doc = await $appwrite.databases.getDocument(
        DB_ID, COLL_ID, authStore.user.$id
      )
      if (doc.preferred_theme) {
        colorMode.preference = doc.preferred_theme
      }
    } catch (e) {
      console.warn('Gagal muat preferensi tema:', e)
    }
  }

  // Watch perubahan tema → auto-save ke Appwrite
  watch(() => colorMode.preference, (newTheme) => {
    saveTheme(newTheme)
  })

  return { loadTheme, saveTheme }
}
