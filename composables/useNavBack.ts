export const useNavBack = (fallback: string = '/') => {
  const router = useRouter()
  
  const goBack = () => {
    // window.history.state.back will be present if there's a previous entry in the app's history
    if (typeof window !== 'undefined' && window.history.state && window.history.state.back) {
      router.back()
    } else {
      // If no history (shared link), navigate to the fallback provided (default: Home)
      router.push(fallback)
    }
  }
  
  return {
    goBack
  }
}
