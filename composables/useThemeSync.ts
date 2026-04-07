import { Query } from 'appwrite'

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
      const { $db } = useNuxtApp()
      await $db.updateDocument(
        DB_ID, COLL_ID, authStore.user.$id,
        { preferred_theme: theme }
      )
    } catch (e: any) {
      // If document doesn't exist, create it
      if (e.code === 404) {
        try {
          const { $db } = useNuxtApp()
          await $db.createDocument(
            DB_ID, COLL_ID, authStore.user.$id,
            { 
              userId: authStore.user.$id,
              preferred_theme: theme,
              points: 0
            }
          )
          console.log('✅ Profile document created on-the-fly')
        } catch (createError) {
          console.warn('Gagal buat dokumen profil baru:', createError)
        }
      } else {
        console.warn('Gagal simpan preferensi tema:', e)
      }
    }
  }

  // Muat tema dari Appwrite saat login
  const loadTheme = async () => {
    if (!authStore.user) return
    try {
      // Use listDocuments with filter to avoid 404 network noise if doc missing
      const { $db } = useNuxtApp()
      const { documents } = await $db.listDocuments(
        DB_ID, COLL_ID, 
        [Query.equal('$id', authStore.user.$id)]
      )
      
      if (documents.length > 0 && documents[0].preferred_theme) {
        colorMode.preference = documents[0].preferred_theme
      }
    } catch (e: any) {
      console.warn('Gagal muat preferensi tema:', e)
    }
  }

  // Watch perubahan tema → auto-save ke Appwrite
  watch(() => colorMode.preference, (newTheme) => {
    saveTheme(newTheme)
  })

  return { loadTheme, saveTheme }
}
