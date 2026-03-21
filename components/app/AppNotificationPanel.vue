<template>
  <div class="absolute right-0 top-full mt-2 w-80 max-h-[420px] bg-surface border border-default
              rounded-xl shadow-lg overflow-hidden z-50 flex flex-col"
       style="box-shadow: var(--shadow-lg);">

    <!-- Header -->
    <div class="flex items-center justify-between px-4 py-3 border-b border-default bg-elevated/50">
      <h3 class="font-bold text-default text-sm">Notifikasi</h3>
      <button
        v-if="notifStore.unreadCount > 0"
        class="text-[11px] font-semibold text-brand hover:underline"
        @click="notifStore.markAllRead()"
      >
        Tandai semua dibaca
      </button>
    </div>

    <!-- List -->
    <div class="flex-1 overflow-y-auto scrollbar-hide">
      <div v-if="notifStore.notifications.length === 0" class="text-center py-10 text-muted text-sm italic">
        Belum ada notifikasi
      </div>

      <NuxtLink
        v-for="notif in notifStore.notifications"
        :key="notif.id"
        :to="notif.path"
        class="flex items-start gap-3 px-4 py-3 border-b border-default/50 hover:bg-elevated/60 transition-colors"
        :class="{ 'bg-elevated/30': !notif.read }"
        @click="handleClick(notif.id)"
      >
        <!-- Icon -->
        <div class="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
             :class="getIconBg(notif.type)">
          <Icon :name="notif.icon" class="w-5 h-5 text-white" />
        </div>

        <!-- Content -->
        <div class="flex-1 min-w-0">
          <p class="text-xs font-semibold" :class="notif.read ? 'text-secondary' : 'text-default'">
            {{ notif.title }}
          </p>
          <p class="text-[11px] text-muted truncate mt-0.5">{{ notif.message }}</p>
          <p class="text-[10px] text-muted mt-1">{{ timeAgo(notif.createdAt) }}</p>
        </div>

        <!-- Unread dot -->
        <span v-if="!notif.read" class="w-2 h-2 rounded-full bg-brand shrink-0 mt-2"></span>
      </NuxtLink>
    </div>

    <!-- Footer -->
    <div v-if="notifStore.notifications.length > 0"
         class="px-4 py-2 border-t border-default text-center">
      <button
        class="text-[11px] font-semibold text-[var(--color-error)] hover:underline"
        @click="notifStore.clearAll()"
      >
        Hapus Semua
      </button>
    </div>
  </div>
</template>

<script setup>
import { useNotificationStore } from '~/stores/notification.store'

const notifStore = useNotificationStore()

const handleClick = (id) => {
  notifStore.markRead(id)
  notifStore.closePanel()
}

const getIconBg = (type) => {
  const map = {
    news: 'bg-saffron',
    video: 'bg-gold',
    post: 'bg-maroon',
    donation: 'bg-maroon',
    info: 'bg-saffron',
  }
  return map[type] || 'bg-saffron'
}

const timeAgo = (dateStr) => {
  const now = Date.now()
  const then = new Date(dateStr).getTime()
  const diff = Math.floor((now - then) / 1000)

  if (diff < 60) return 'Baru saja'
  if (diff < 3600) return `${Math.floor(diff / 60)} menit lalu`
  if (diff < 86400) return `${Math.floor(diff / 3600)} jam lalu`
  if (diff < 604800) return `${Math.floor(diff / 86400)} hari lalu`
  return new Date(dateStr).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })
}
</script>
