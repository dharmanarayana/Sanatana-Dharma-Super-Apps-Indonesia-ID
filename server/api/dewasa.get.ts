import fs from 'fs'
import path from 'path'
import axios from 'axios'
import * as cheerio from 'cheerio'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const tanggal = query.tanggal || new Date().getDate()
  const bulan = query.bulan || new Date().getMonth() + 1
  const tahun = query.tahun || new Date().getFullYear()

  const dateKey = `${tahun}-${String(bulan).padStart(2,'0')}-${String(tanggal).padStart(2,'0')}`

  // 1. Try to read from local JSON fallback first
  try {
    const filePath = path.resolve(`public/data/dewasa-${tahun}.json`)
    if (fs.existsSync(filePath)) {
      const fileData = fs.readFileSync(filePath, 'utf-8')
      const allDewasa = JSON.parse(fileData)
      
      if (allDewasa[dateKey]) {
        // We found the data locally, return it immediately (0 latency fallback).
        return {
          date: dateKey,
          items: allDewasa[dateKey],
          source: 'local-json'
        }
      }
    }
  } catch (err) {
    console.warn('Failed to read local fallback dewasa JSON', err)
    // Silently continue to live fetch if JSON read fails
  }

  // 2. Fallback to live API Scraping
  const url = `https://kalenderbali.org/alaayu.php?bulan=${bulan}&tanggal=${tanggal}&tahun=${tahun}`
  
  // Note: Using the specific cookies/headers known to bypass the server's anti-scraping
  const COOKIES = `_ga=GA1.1.1682399883.1773201421; PHPSESSID=82a31c9b643acedddac457417e113071; wssplashuid=7602c13443352d233a8e86517b6befadd98ac058.1774097310.1; setkoki=installkoki; _ga_P2QCCZCXHC=GS2.1.s1774092720$o3$g1$t1774094137$j12$l0$h0; FCCDCF=%5Bnull%2Cnull%2Cnull%2Cnull%2Cnull%2Cnull%2C%5B%5B32%2C%22%5B%5C%22009e66f0-ff84-4157-9a5e-23bcf13adfac%5C%22%2C%5B1774092721%2C526000000%5D%5D%22%5D%5D%5D; FCNEC=%5B%5B%22AKsRol-PRmcdUKVCnh8Guj_9pX5ZGzufp-Ze1jo9dyUdJKdCaz6VAxt0jHOQRMotWxQOtrMAXx3Uw6aSMLk5bisxLOuCjKa8j64feYXKn8PSGoV9CsILfeNMBCm7V6A1U7Gy6fhi87nHWwT00GD7en6Y8otE908nGQ%3D%3D%22%5D%5D`
  const USER_AGENT = `Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36`

  try {
    const { data } = await axios.get(url, {
      timeout: 10000,
      headers: {
        'User-Agent': USER_AGENT,
        'Cookie': COOKIES,
        'Referer': 'https://kalenderbali.org/'
      }
    })

    if (typeof data === 'object' && data.message && data.message.includes('Access denied')) {
      throw createError({ statusCode: 403, statusMessage: 'KalenderBali Access Denied' })
    }

    const $ = cheerio.load(data)
    const items: { name: string; description: string }[] = []

    $('li').each((i, el) => {
      const html = $(el).html()
      if (html && html.includes('<b>')) {
        const nameNode = $(el).find('b')
        if (nameNode.length) {
          let name = nameNode.first().text().trim()
          const clone = $(el).clone()
          clone.find('b').remove()
          let desc = clone.text().trim()
          
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
})
