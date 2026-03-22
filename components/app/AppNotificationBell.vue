<template>
  <div class="relative notification-wrapper">
    <button
      class="relative flex items-center justify-center
             w-10 h-10 rounded-full
             transition-all duration-200
             hover:bg-[var(--state-hover)]
             active:scale-90"
      @click="notifStore.togglePanel()"
      aria-label="Toggle notifications"
    >
      <svg xmlns="http://www.w3.org/2000/svg" 
           class="w-5 h-5 transition-colors duration-200"
           :class="bellColor"
           viewBox="0 0 24 24" fill="none" 
           stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"></path>
        <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"></path>
      </svg>

      <!-- Unread badge -->
      <span
        v-if="notifStore.unreadCount > 0"
        class="absolute top-2 right-2 min-w-[16px] h-[16px] px-1 flex items-center justify-center
               bg-[var(--color-error,#C62828)] text-white text-[9px] font-bold rounded-full
               animate-pulse shadow-lg"
      >
        {{ notifStore.unreadCount > 9 ? '9+' : notifStore.unreadCount }}
      </span>
    </button>

    <!-- Toast Alert — muncul saat notifikasi baru masuk -->
    <Transition name="toast">
      <div
        v-if="notifStore.latestToast && !notifStore.showPanel"
        class="absolute right-0 top-full mt-2 w-72 bg-surface border border-brand/30
               rounded-xl shadow-lg overflow-hidden z-[100] cursor-pointer"
        style="box-shadow: 0 4px 24px rgba(255,107,0,0.18);"
        @click="handleToastClick(notifStore.latestToast)"
      >
        <div class="flex items-center gap-3 px-4 py-3">
          <!-- Icon -->
          <div class="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
               :class="getIconBg(notifStore.latestToast.type)">
            <Icon :name="notifStore.latestToast.icon" class="w-5 h-5 text-white" />
          </div>
          <!-- Content -->
          <div class="flex-1 min-w-0">
            <p class="text-xs font-semibold text-brand">{{ notifStore.latestToast.title }}</p>
            <p class="text-[11px] text-default truncate mt-0.5">{{ notifStore.latestToast.message }}</p>
          </div>
          <!-- Close -->
          <button
            class="shrink-0 p-1 rounded-full hover:bg-elevated"
            @click.stop="notifStore.dismissToast()"
          >
            <Icon name="lucide:x" class="w-3.5 h-3.5 text-muted" />
          </button>
        </div>
        <!-- Progress bar -->
        <div class="h-[3px] bg-brand/20">
          <div class="h-full bg-brand toast-progress"></div>
        </div>
      </div>
    </Transition>

    <!-- Notification Panel Dropdown -->
    <AppNotificationPanel v-if="notifStore.showPanel" />
  </div>
</template>

<script setup lang="ts">
import { useNotificationStore, type NotificationItem } from '~/stores/notification.store'
import { useAuthStore } from '~/stores/auth.store'

const notifStore = useNotificationStore()
const authStore = useAuthStore()
const colorMode = useColorMode()
const router = useRouter()

const bellColor = computed(() => {
  if (colorMode.preference === 'dark') return 'text-[var(--brand-secondary)]'
  if (colorMode.preference === 'light') return 'text-[var(--brand-primary)]'
  return 'text-[var(--text-secondary)]'
})

// Welcome Toast Logic
const showWelcomeToast = () => {
  const name = authStore.user?.name?.split(' ')[0] || 'Umat Sedharma'
  const message = authStore.isLoggedIn 
    ? `Rahajeng rauh, ${name}! 🙏` 
    : 'Selamat datang di Sanatana Dharma Digital!'

  notifStore.showToast({
    id: 'welcome-' + Date.now(),
    type: 'info',
    title: 'Welcome',
    message: message,
    path: '/',
    icon: 'lucide:bell',
    read: false,
    createdAt: new Date().toISOString()
  })
}

const handleToastClick = (notif: NotificationItem | null) => {
  if (notif) {
    notifStore.markRead(notif.id)
    notifStore.dismissToast()
    router.push(notif.path)
  }
}

const getIconBg = (type: string) => {
  const map: Record<string, string> = {
    news: 'bg-saffron',
    video: 'bg-gold',
    post: 'bg-maroon',
    donation: 'bg-maroon',
    info: 'bg-saffron',
  }
  return map[type] || 'bg-saffron'
}

// Close panel when clicking outside
const handleClickOutside = (e: MouseEvent) => {
  const target = e.target as HTMLElement
  if (notifStore.showPanel && !target.closest('.notification-wrapper')) {
    notifStore.closePanel()
  }
}

let welcomeTimer: ReturnType<typeof setTimeout> | null = null

onMounted(() => {
  document.addEventListener('click', handleClickOutside, true)
  
  // Trigger welcome toast after a short delay
  welcomeTimer = setTimeout(showWelcomeToast, 1500)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside, true)
  if (welcomeTimer) clearTimeout(welcomeTimer)
})
</script>

<style scoped>
/* Toast slide-in animation */
.toast-enter-active {
  animation: toast-in 0.35s ease-out;
}
.toast-leave-active {
  animation: toast-out 0.25s ease-in forwards;
}

@keyframes toast-in {
  0% { opacity: 0; transform: translateY(-8px) scale(0.95); }
  100% { opacity: 1; transform: translateY(0) scale(1); }
}
@keyframes toast-out {
  0% { opacity: 1; transform: translateY(0) scale(1); }
  100% { opacity: 0; transform: translateY(-8px) scale(0.95); }
}

/* Progress bar countdown (4s) */
.toast-progress {
  animation: progress-shrink 4s linear forwards;
}
@keyframes progress-shrink {
  0% { width: 100%; }
  100% { width: 0%; }
}
</style>
