import { ref, computed, watch } from 'vue'
import dayjs from 'dayjs'
import 'dayjs/locale/id'

dayjs.locale('id')

export const useKalender = () => {
  const currentDate = dayjs()
  const selectedYear = ref(currentDate.year())
  const selectedMonth = ref(currentDate.month() + 1) // 1-12
  const selectedDate = ref(currentDate.date())
  const calendarData = ref<any[]>([])
  const isLoading = ref(false)

  const fetchCalendarData = async (year: number) => {
    isLoading.value = true
    try {
      const data = await $fetch(`/data/calendar-${year}.json`)
      if (data) {
        calendarData.value = data as any[]
      } else {
        calendarData.value = []
      }
    } catch (e) {
      console.error('Error fetching calendar data:', e)
      calendarData.value = []
    } finally {
      isLoading.value = false
    }
  }

  const currentMonthData = computed(() => {
    return calendarData.value.find(m => m.month === selectedMonth.value) || { days: [], religiousDays: [], holidays: [] }
  })

  const gridDays = computed(() => {
    const data = currentMonthData.value
    if (!data.days || data.days.length === 0) return []

    const firstDayOfMonth = dayjs(`${selectedYear.value}-${String(selectedMonth.value).padStart(2, '0')}-01`)
    const startingDayOfWeek = firstDayOfMonth.day() // 0 = Sunday, 1 = Monday, etc.

    const daysInMonth = firstDayOfMonth.daysInMonth()
    const grid = []

    // Padding from previous month
    for (let i = 0; i < startingDayOfWeek; i++) {
      grid.push({ date: null, isCurrentMonth: false })
    }

    // Current month days
    for (let i = 1; i <= daysInMonth; i++) {
       const dayInfo = data.days.find((d: any) => d.date === i)
       grid.push({
         date: i,
         isCurrentMonth: true,
         sakaInfo: dayInfo?.sakaInfo || null,
         hasRerainan: data.religiousDays?.some((r: any) => parseInt(r.date) === i),
         hasHoliday: data.holidays?.some((h: any) => parseInt(h.date) === i)
       })
    }

    return grid
  })

  const selectedDayInfo = computed(() => {
    return currentMonthData.value.days?.find((d: any) => d.date === selectedDate.value)
  })
  
  const currentReligiousDays = computed(() => {
    return currentMonthData.value.religiousDays || []
  })
  
  const currentHolidays = computed(() => {
    return currentMonthData.value.holidays || []
  })

  // Watch for year changes to fetch new data
  watch(selectedYear, (newYear) => {
    if (newYear >= 2025 && newYear <= 2026) {
       fetchCalendarData(newYear)
    }
  }, { immediate: true })

  const nextMonth = () => {
    if (selectedMonth.value === 12) {
      selectedMonth.value = 1
      selectedYear.value++
    } else {
      selectedMonth.value++
    }
    selectedDate.value = 1
  }

  const prevMonth = () => {
    if (selectedMonth.value === 1) {
      selectedMonth.value = 12
      selectedYear.value--
    } else {
      selectedMonth.value--
    }
    selectedDate.value = 1
  }

  const selectDate = (date: number | null) => {
    if (date) {
      selectedDate.value = date
    }
  }

  const monthName = computed(() => {
    return dayjs(`${selectedYear.value}-${String(selectedMonth.value).padStart(2, '0')}-01`).format('MMMM')
  })

  return {
    selectedYear,
    selectedMonth,
    selectedDate,
    isLoading,
    currentMonthData,
    gridDays,
    selectedDayInfo,
    currentReligiousDays,
    currentHolidays,
    monthName,
    nextMonth,
    prevMonth,
    selectDate
  }
}
