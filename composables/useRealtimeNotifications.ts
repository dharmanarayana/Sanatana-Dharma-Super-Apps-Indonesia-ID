import type { RealtimeResponseEvent } from 'appwrite'
import { useNotificationStore } from '~/stores/notification.store'

const COLLECTION_CONFIG: Record<string, { type: 'news' | 'video' | 'post' | 'donation'; label: string; icon: string; path: string; titleField: string }> = {
  news:      { type: 'news',     label: 'Berita Baru',   icon: 'lucide:newspaper',     path: '/berita',      titleField: 'title' },
  videos:    { type: 'video',    label: 'Video Baru',    icon: 'lucide:clapperboard',  path: '/video',       titleField: 'title' },
  posts:     { type: 'post',     label: 'Postingan Baru', icon: 'lucide:message-square', path: '/forum',      titleField: 'title' },
  donations: { type: 'donation', label: 'Donasi Baru',   icon: 'lucide:heart',          path: '/donasi',     titleField: 'title' },
}

const DB_ID = 'sanatana-dharma-db'

export function useRealtimeNotifications() {
  const { $appwrite } = useNuxtApp()
  const notifStore = useNotificationStore()

  let unsubscribe: (() => void) | null = null

  const subscribe = () => {
    // Build channel list for all tracked collections
    const channels = Object.keys(COLLECTION_CONFIG).map(
      collectionId => `databases.${DB_ID}.collections.${collectionId}.documents`
    )

    unsubscribe = $appwrite.client.subscribe(channels, (response: RealtimeResponseEvent<any>) => {
      // Only react to document creation events
      const events = response.events || []
      const isCreate = events.some((e: string) => e.includes('.create'))
      if (!isCreate) return

      // Extract collection ID from the event channel
      const collectionId = extractCollectionId(events)
      if (!collectionId || !COLLECTION_CONFIG[collectionId]) return

      const config = COLLECTION_CONFIG[collectionId]
      const payload = response.payload as any
      const docTitle = payload?.[config.titleField] || 'Konten baru'

      notifStore.addNotification({
        type: config.type,
        title: config.label,
        message: docTitle,
        path: config.path,
        icon: config.icon,
      })
    })
  }

  const stop = () => {
    if (unsubscribe) {
      unsubscribe()
      unsubscribe = null
    }
  }

  return { subscribe, stop }
}

function extractCollectionId(events: string[]): string | null {
  for (const event of events) {
    // Pattern: databases.*.collections.{collectionId}.documents.*.create
    const match = event.match(/collections\.([^.]+)\.documents/)
    if (match) return match[1]
  }
  return null
}
