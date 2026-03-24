import axios from 'axios'
import * as cheerio from 'cheerio'

export default defineCachedEventHandler(async (event) => {
  const query = getQuery(event)
  const tanggal = query.tanggal || new Date().getDate()
  const bulan = query.bulan || new Date().getMonth() + 1
  const tahun = query.tahun || new Date().getFullYear()

  const dateKey = `${tahun}-${String(bulan).padStart(2,'0')}-${String(tanggal).padStart(2,'0')}`

  // 1. Try to read from local JSON fallback first
  try {
    const allDewasa: any = await useStorage('assets:server').getItem(`data/dewasa-${tahun}.json`)
    
    if (allDewasa && allDewasa[dateKey]) {
      // We found the data locally, return it immediately (0 latency fallback).
      return {
        date: dateKey,
        items: allDewasa[dateKey],
        source: 'local-json'
      }
    }
  } catch (err) {
    console.warn('Failed to read local fallback dewasa JSON', err)
    // Silently continue to live fetch if JSON read fails
  }

  // 2. Fallback to live API Scraping
  const url = `https://kalenderbali.com/ala-ayuning-dewasa/?tg=${tanggal}&bl=${bulan}&th=${tahun}`
  const USER_AGENT = `Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36`

  try {
    const { data } = await axios.get(url, {
      timeout: 10000,
      headers: {
        'User-Agent': USER_AGENT,
        'Referer': 'https://kalenderbali.com/'
      }
    })

    const $ = cheerio.load(data)
    const items: { name: string; description: string }[] = []

    $('div.isi ul li').each((i, el) => {
      const html = $(el).html()
      if (html && html.includes('<b>')) {
        const nameNode = $(el).find('b')
        if (nameNode.length) {
          let name = nameNode.first().text().trim()
          const clone = $(el).clone()
          clone.find('b').remove()
          let desc = clone.text().trim()
          
          if (desc.startsWith(':')) desc = desc.substring(1).trim()
          if (desc.startsWith('.')) desc = desc.substring(1).trim()
          if (name) items.push({ name, description: desc })
        }
      }
    })

    return {
      date: dateKey,
      items,
      source: 'live'
    }
  } catch (error: any) {
    console.error('Dewasa Ayu live fetch error:', error.message)
    return {
      date: dateKey,
      items: [],
      error: 'Failed to fetch'
    }
  }
}, {
  maxAge: 60 * 60 * 24, // 24 hours
  swr: true,
  getKey: (event) => {
    const query = getQuery(event)
    const t = query.tanggal || new Date().getDate()
    const b = query.bulan || new Date().getMonth() + 1
    const th = query.tahun || new Date().getFullYear()
    return `dewasa-${th}-${b}-${t}`
  }
})
