export const useNotificationPermission = () => {
  const permission = ref<NotificationPermission>('default')
  const isSupported = ref(false)

  onMounted(() => {
    isSupported.value = 'Notification' in window
    if (isSupported.value) {
      permission.value = Notification.permission
    }
  })

  const requestPermission = async () => {
    if (!isSupported.value) return false
    
    try {
      const result = await Notification.requestPermission()
      permission.value = result
      return result === 'granted'
    } catch (error) {
      console.error('Error requesting notification permission:', error)
      return false
    }
  }

  return {
    permission,
    isSupported,
    requestPermission
  }
}
