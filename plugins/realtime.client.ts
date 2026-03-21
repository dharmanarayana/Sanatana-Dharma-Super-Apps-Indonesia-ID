import { useRealtimeNotifications } from '~/composables/useRealtimeNotifications'

export default defineNuxtPlugin(() => {
  // Only run on client-side
  if (import.meta.server) return

  const { subscribe, stop } = useRealtimeNotifications()

  // Start realtime subscription
  subscribe()

  // Cleanup on app unmount (HMR / navigation)
  if (import.meta.hot) {
    import.meta.hot.dispose(() => {
      stop()
    })
  }
})
