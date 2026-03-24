export const useGlobalSearch = () => {
  const isVisible = useState<boolean>('global-search-visible', () => false)
  const searchQuery = useState<string>('global-search-query', () => '')
  const results = useState<any[]>('global-search-results', () => [])
  const isLoading = useState<boolean>('global-search-loading', () => false)
  const hasSearched = useState<boolean>('global-search-has-searched', () => false)

  const openSearch = () => {
    isVisible.value = true
  }

  const closeSearch = () => {
    isVisible.value = false
    searchQuery.value = ''
    results.value = []
    hasSearched.value = false
  }

  const toggleSearch = () => {
    if (isVisible.value) closeSearch()
    else openSearch()
  }

  const performSearch = async (q: string) => {
    if (!q || q.trim().length < 2) {
      results.value = []
      hasSearched.value = false
      return
    }
    
    isLoading.value = true
    hasSearched.value = true
    try {
      const data = await $fetch<{ results: any[] }>(`/api/search?q=${encodeURIComponent(q)}`)
      results.value = data.results || []
    } catch (e) {
      console.error('Global search error:', e)
      results.value = []
    } finally {
      isLoading.value = false
    }
  }

  // Auto search with debounce
  let searchTimeout: any = null
  watch(searchQuery, (newVal) => {
    if (searchTimeout) clearTimeout(searchTimeout)
    
    if (!newVal || newVal.trim().length < 2) {
      results.value = []
      hasSearched.value = false
      return
    }

    searchTimeout = setTimeout(() => {
      performSearch(newVal)
    }, 400)
  })

  return {
    isVisible,
    searchQuery,
    results,
    isLoading,
    hasSearched,
    openSearch,
    closeSearch,
    toggleSearch
  }
}
