// composables/useDevice.ts
export const useDevice = () => {
  const isDesktop = ref(false)
  const isTablet  = ref(false)
  const isMobile  = ref(false)

  const updateDevice = () => {
    if (import.meta.server) return
    const w = window.innerWidth
    isDesktop.value = w >= 1024
    isTablet.value  = w >= 768 && w < 1024
    isMobile.value  = w < 768
  }

  onMounted(() => {
    updateDevice()
    window.addEventListener('resize', updateDevice, { passive: true })
  })

  onUnmounted(() => {
    if (import.meta.server) return
    window.removeEventListener('resize', updateDevice)
  })

  // Helper computed
  const isMobileOrTablet = computed(() => !isDesktop.value)
  const deviceLabel = computed(() => {
    if (isDesktop.value) return 'desktop'
    if (isTablet.value)  return 'tablet'
    return 'mobile'
  })

  return { isDesktop, isTablet, isMobile, isMobileOrTablet, deviceLabel }
}
