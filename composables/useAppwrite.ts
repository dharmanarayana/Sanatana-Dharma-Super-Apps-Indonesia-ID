export const useAppwrite = () => {
  const { $appwrite } = useNuxtApp()
  return $appwrite
}
