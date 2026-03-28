import { useNetwork } from '@vueuse/core'

/**
 * Global composable to monitor network status across the app.
 * Provides a reliable isOnline ref that syncs with browser events.
 */
export const useNetworkStatus = () => {
  const { isSupported, isOnline, offlineAt, onlineAt } = useNetwork()

  const refreshPage = () => {
    if (process.client) {
      window.location.reload()
    }
  }

  return {
    isSupported,
    isOnline,
    offlineAt,
    onlineAt,
    refreshPage
  }
}
