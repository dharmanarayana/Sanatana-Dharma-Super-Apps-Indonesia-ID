import { useLocalStorage } from '@vueuse/core'

export const useJapaMala = () => {
  const sessionCount = useLocalStorage<number>('japa-session-count', 0)
  const totalCount = useLocalStorage<number>('japa-total-count', 0)
  const targetCount = ref(108)
  const activeMantra = useLocalStorage<string>('japa-active-mantra', 'Gayatri Mantram')

  const mantras = [
    { name: 'Gayatri Mantram', meaning: 'Mantra pencerahan jiwa' },
    { name: 'Om Namah Shivaya', meaning: 'Penghormatan kepada Siwa' },
    { name: 'Maha Mrityunjaya', meaning: 'Mantra penakluk kematian' },
    { name: 'Hare Krishna', meaning: 'Mantra cinta kasih Tuhan' },
    { name: 'Om Shanti Shanti Om', meaning: 'Mantra kedamaian alam semesta' }
  ]

  const increment = () => {
    sessionCount.value++
    totalCount.value++
    
    // Haptic Feedback
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate(40)
    }

    // Every 108, give a stronger vibration
    if (sessionCount.value % 108 === 0) {
      if (typeof navigator !== 'undefined' && navigator.vibrate) {
        navigator.vibrate([100, 50, 100])
      }
    }
  }

  const resetSession = () => {
    sessionCount.value = 0
  }

  const setMantra = (name: string) => {
    activeMantra.value = name
    resetSession()
  }

  return {
    sessionCount,
    totalCount,
    targetCount,
    activeMantra,
    mantras,
    increment,
    resetSession,
    setMantra
  }
}
