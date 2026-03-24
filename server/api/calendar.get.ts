import fs from 'fs'
import path from 'path'
import { resolvePublicDataPath } from '../utils/paths'

export default defineCachedEventHandler(async (event) => {
  const query = getQuery(event)
  const year = query.year || new Date().getFullYear()

  try {
    const filePath = resolvePublicDataPath(`calendar-${year}.json`)
    
    if (filePath && fs.existsSync(filePath)) {
      const fileData = fs.readFileSync(filePath, 'utf-8')
      const calendarData = JSON.parse(fileData)
      return calendarData
    } else {
      console.warn(`Calendar file not found: ${filePath}`)
      return []
    }
  } catch (err) {
    console.error(`Error reading calendar data for year ${year}:`, err)
    return []
  }
}, {
  maxAge: 60 * 60 * 24 * 7, // 7 days
  swr: true,
  getKey: (event) => {
    const query = getQuery(event)
    return `calendar-${query.year || new Date().getFullYear()}`
  }
})
