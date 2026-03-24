export default defineCachedEventHandler(async (event) => {
  const query = getQuery(event)
  const year = query.year || new Date().getFullYear()

  try {
    const calendarData: any = await useStorage('assets:server').getItem(`data/calendar-${year}.json`)
    if (calendarData) {
      return calendarData
    }
    return []
  } catch (err) {
    console.error(`Error reading calendar data for year ${year}:`, err)
    return []
  }
}, {
  maxAge: 60 * 60 * 24 * 7, // 7 days
  swr: true,
  getKey: (event) => {
    const query = getQuery(event)
    return `calendar-v2-${query.year || new Date().getFullYear()}`
  }
})
