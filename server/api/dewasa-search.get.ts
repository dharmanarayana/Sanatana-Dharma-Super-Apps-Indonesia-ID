export default defineEventHandler(async (event: any) => {
  const query = getQuery(event)
  const activity = (query.activity as string) || ''
  const month = parseInt(query.bulan as string) || new Date().getMonth() + 1
  const year = parseInt(query.tahun as string) || new Date().getFullYear()

  if (!activity) {
    return {
      success: false,
      message: 'Activity is required',
      results: []
    }
  }

  // Keyword mapping for common activities
  const activityKeywords: Record<string, string[]> = {
    'pernikahan': ['wiwaha', 'pernikahan', 'penganten', 'meminang'],
    'bangunan': ['membangun rumah', 'mengatapi rumah', 'pondasi', 'tembok pekarangan', 'pindah rumah'],
    'pertanian': ['bercocok tanam', 'menanam padi', 'memetik buah', 'membajak', 'menanam'],
    'dagang': ['berdagang', 'memulai usaha', 'berjualan', 'tempat berdagang', 'membuka toko'],
    'yadnya': ['yadnya', 'dewa yadnya', 'bhuta yadnya', 'manusa yadnya', 'pitra yadnya', 'penyucian diri'],
    'ternak': ['memelihara ternak', 'ternak', 'ayam', 'sapi', 'kerbau', 'babi'],
  }

  const searchType = (query.type as string) || 'baik'
  const keywords = activityKeywords[activity.toLowerCase()] || [activity.toLowerCase()]
  
  try {
    const allDewasa: any = await useStorage('assets:server').getItem(`data/dewasa-${year}.json`)
    
    if (!allDewasa) {
      return {
        success: false,
        message: `Data for year ${year} not found`,
        results: []
      }
    }

    const results: any[] = []
    const monthPrefix = `${year}-${String(month).padStart(2, '0')}`

    Object.entries(allDewasa).forEach(([date, items]: [string, any]) => {
      if (date.startsWith(monthPrefix)) {
        const matchingItems = items.filter((item: any) => {
          const lowerDesc = item.description.toLowerCase()
          const lowerName = item.name.toLowerCase()
          
          if (searchType === 'baik') {
            return keywords.some(kw => {
              const hasKeyword = lowerDesc.includes(kw) || lowerName.includes(kw)
              if (!hasKeyword) return false
              
              const notGoodMatch = lowerDesc.match(new RegExp(`tidak baik (?:untuk|dipakai|sebagai|melakukan).*?${kw}`, 'i'))
              const isGoodMatch = lowerDesc.match(new RegExp(`baik (?:untuk|dipakai|sebagai|melakukan).*?${kw}`, 'i'))
              
              if (notGoodMatch) return false
              if (isGoodMatch) return true
              return lowerDesc.startsWith('baik untuk') && hasKeyword
            })
          } else {
            // Logic for "Buruk" (Bad Days)
            return keywords.some(kw => {
              const hasKeyword = lowerDesc.includes(kw) || lowerName.includes(kw)
              if (!hasKeyword) return false

              const notGoodMatch = lowerDesc.match(new RegExp(`tidak baik (?:untuk|dipakai|sebagai|melakukan).*?${kw}`, 'i'))
              const prohibitedMatch = lowerDesc.match(new RegExp(`dilarang (?:melakukan).*?${kw}`, 'i'))
              const alaMatch = lowerDesc.includes('ala') && (lowerDesc.includes('buruk') || lowerDesc.includes('tidak baik'))
              
              return notGoodMatch || prohibitedMatch || (alaMatch && lowerDesc.includes(kw))
            })
          }
        })

        if (matchingItems.length > 0) {
          results.push({
            date,
            items: matchingItems
          })
        }
      }
    })

    return {
      success: true,
      activity,
      month,
      year,
      results
    }
  } catch (err) {
    console.error('Search Dewasa error:', err)
    return {
      success: false,
      message: 'Internal server error',
      results: []
    }
  }
})
