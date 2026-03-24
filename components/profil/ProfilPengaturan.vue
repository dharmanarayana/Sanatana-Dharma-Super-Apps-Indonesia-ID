<template>
  <div class="card divide-y divide-default overflow-hidden">
    <!-- Setting List -->
    <button v-for="item in settings" :key="item.id"
            @click="activeModal = item.id"
            class="w-full p-5 text-left text-sm font-bold hover:bg-surface transition-colors flex items-center justify-between group">
      <div class="flex items-center gap-3">
        <div class="w-8 h-8 rounded-lg bg-brand/10 flex items-center justify-center text-brand group-hover:bg-brand group-hover:text-white transition-all">
          <Icon :name="item.icon" size="18" />
        </div>
        <span class="text-default">{{ $t(`profile.${item.id.toLowerCase()}`) }}</span>
      </div>
      <Icon name="lucide:chevron-right" size="16" class="text-muted group-hover:translate-x-1 transition-transform" />
    </button>

    <!-- Modals -->
    <UiModal :show="activeModal === 'Security'" :title="$t('profile.security')" @close="closeSecurityModal">
      <div v-if="securityMode === 'list'" class="space-y-6">
        <p class="text-xs text-muted leading-relaxed">Kelola keamanan akun Anda untuk melindungi data personal.</p>
        <div class="space-y-4">
          <button @click="securityMode = 'password'" 
                  class="w-full p-4 rounded-xl border border-default flex items-center justify-between hover:border-brand transition-colors group">
             <div class="text-left">
               <p class="text-sm font-bold group-hover:text-brand transition-colors">Ganti Kata Sandi</p>
               <p class="text-[10px] text-muted">Perbarui kata sandi Anda secara berkala</p>
             </div>
             <Icon name="lucide:key" size="18" class="text-brand" />
          </button>
          <div class="w-full p-4 rounded-xl border border-default flex items-center justify-between">
             <div class="text-left">
               <p class="text-sm font-bold">Verifikasi Dua Langkah</p>
               <p class="text-[10px] text-muted">Tambahkan lapisan keamanan ekstra</p>
             </div>
             <input type="checkbox" v-model="mfaEnabled" @change="handleMfaToggle" class="toggle toggle-brand" />
          </div>
        </div>
      </div>

      <!-- Change Password Form -->
      <div v-else-if="securityMode === 'password'" class="space-y-6">
        <div class="flex items-center gap-2 mb-2">
          <button @click="securityMode = 'list'" class="p-1 hover:bg-default/5 rounded-lg transition-colors">
            <Icon name="lucide:arrow-left" size="18" class="text-muted" />
          </button>
          <span class="text-xs font-bold text-muted uppercase tracking-wider">Kembali</span>
        </div>
        
        <form @submit.prevent="handlePasswordUpdate" class="space-y-4">
          <div class="space-y-2">
            <label class="text-[10px] font-bold text-muted ml-1 uppercase">Kata Sandi Saat Ini</label>
            <input v-model="passwordForm.old" type="password" required
                   class="w-full p-4 rounded-xl bg-surface border border-default focus:border-brand outline-none transition-all text-sm"
                   placeholder="••••••••" />
          </div>
          <div class="space-y-2">
            <label class="text-[10px] font-bold text-muted ml-1 uppercase">Kata Sandi Baru</label>
            <input v-model="passwordForm.new" type="password" required
                   class="w-full p-4 rounded-xl bg-surface border border-default focus:border-brand outline-none transition-all text-sm"
                   placeholder="••••••••" />
          </div>
          <div class="space-y-2">
            <label class="text-[10px] font-bold text-muted ml-1 uppercase">Konfirmasi Kata Sandi Baru</label>
            <input v-model="passwordForm.confirm" type="password" required
                   class="w-full p-4 rounded-xl bg-surface border border-default focus:border-brand outline-none transition-all text-sm"
                   placeholder="••••••••" />
          </div>

          <p v-if="passwordError" class="text-[10px] text-error px-1">{{ passwordError }}</p>

          <button type="submit" :disabled="isUpdating"
                  class="w-full py-4 bg-brand text-white font-bold rounded-xl shadow-lg shadow-brand/20 hover:shadow-brand/40 active:scale-[0.98] transition-all disabled:opacity-50">
            <span v-if="isUpdating" class="flex items-center justify-center gap-2">
              <Icon name="lucide:loader-2" class="animate-spin" size="18" />
              Memperbarui...
            </span>
            <span v-else>Simpan Kata Sandi Baru</span>
          </button>
        </form>
      </div>
    </UiModal>

    <UiModal :show="activeModal === 'Notifications'" :title="$t('profile.notifications')" @close="activeModal = null">
      <div class="space-y-6">
        <p class="text-xs text-muted">{{ $t('settings.notif_desc') }}</p>
        <div class="space-y-2">
          <div v-for="n in notificationOptions" :key="n.id" class="flex items-center justify-between p-4 rounded-xl bg-surface/50 border border-default">
            <div>
              <p class="text-sm font-bold">{{ n.label }}</p>
              <p class="text-[10px] text-muted">{{ n.desc }}</p>
            </div>
            <input type="checkbox" :checked="n.enabled" @change="(e) => toggleNotif(n.id, (e.target as HTMLInputElement).checked)" class="toggle toggle-brand" />
          </div>
        </div>
      </div>
    </UiModal>

    <UiModal :show="activeModal === 'Appearance'" :title="$t('settings.theme_title')" @close="activeModal = null">
      <div class="space-y-8">
        <!-- Theme Mode Selection -->
        <div class="space-y-4">
          <p class="text-[10px] font-bold text-muted uppercase tracking-wider ml-1">Mode Aplikasi</p>
          <div class="grid grid-cols-3 gap-3">
            <button v-for="t in themes" :key="t.id"
                    @click="colorMode.preference = t.id"
                    :class="['flex-1 p-3 rounded-2xl border flex flex-col items-center gap-2 transition-all',
                             colorMode.preference === t.id ? 'border-brand bg-brand/5' : 'border-default hover:border-brand/40']">
              <Icon :name="t.icon" size="20" :class="colorMode.preference === t.id ? 'text-brand' : 'text-muted'" />
              <span class="text-[11px] font-bold" :class="colorMode.preference === t.id ? 'text-brand' : 'text-default'">{{ $t(`settings.theme_${t.id}`) }}</span>
            </button>
          </div>
        </div>

        <!-- Accent Color Selection -->
        <div class="space-y-4">
          <p class="text-[10px] font-bold text-muted uppercase tracking-wider ml-1">Warna Aksen</p>
          <div class="grid grid-cols-3 sm:grid-cols-6 gap-3">
            <button v-for="color in accentColors" :key="color.id"
                    @click="applyTheme(color.id)"
                    :class="['h-12 rounded-2xl border-2 transition-all flex items-center justify-center p-1',
                             selectedColorId === color.id ? 'border-brand scale-110 shadow-lg' : 'border-transparent hover:scale-105']"
                    :title="color.label">
              <div class="w-full h-full rounded-xl" :style="{ backgroundColor: colorMode.value === 'dark' ? color.dark : color.light }">
                <Icon v-if="selectedColorId === color.id" name="lucide:check" size="16" class="text-white mx-auto mt-2" />
              </div>
            </button>
          </div>
        </div>
      </div>
    </UiModal>

    <UiModal :show="activeModal === 'Language'" :title="$t('settings.lang_title')" @close="activeModal = null">
      <div class="space-y-6">
        <p class="text-xs text-muted font-medium">{{ $t('settings.lang_desc') }}</p>
        <div class="space-y-2">
          <button v-for="l in locales" :key="l.code"
                  @click="handleLocaleChange(l.code)"
                  :class="['w-full p-4 rounded-xl border flex items-center justify-between transition-all',
                           locale === l.code ? 'border-brand bg-brand/5' : 'border-default hover:border-brand/40']">
            <div class="flex items-center gap-3">
              <span class="text-xl">{{ getFlag(l.code) }}</span>
              <span class="text-sm font-bold" :class="locale === l.code ? 'text-brand' : 'text-default'">{{ l.name }}</span>
            </div>
            <Icon v-if="locale === l.code" name="lucide:check" size="18" class="text-brand" />
          </button>
        </div>

        <!-- Balinese Warning -->
        <Transition name="fade">
          <div v-if="locale === 'bali'" class="p-4 rounded-xl bg-brand/5 border border-brand/20 flex gap-3">
            <Icon name="lucide:info" size="18" class="text-brand shrink-0 mt-0.5" />
            <p class="text-[10px] text-default leading-relaxed italic">
              {{ $t('settings.lang_bali_warning') }}
            </p>
          </div>
        </Transition>
      </div>
    </UiModal>
  </div>
</template>

<script setup lang="ts">
const colorMode = useColorMode()
const { locale, locales, setLocale } = useI18n()
const { updatePassword, toggleMFA } = useAuth()
const { accentColors, selectedColorId, applyTheme } = useTheme()
const authStore = useAuthStore()

onMounted(() => {
  applyTheme()
})

const activeModal = ref<string | null>(null)

// Security States
const securityMode = ref<'list' | 'password'>('list')
const mfaEnabled = ref(authStore.user?.mfa || false)
const isUpdating = ref(false)
const passwordError = ref('')
const passwordForm = ref({
  old: '',
  new: '',
  confirm: ''
})

const settings = [
  { id: 'Security', label: 'Keamanan', icon: 'lucide:shield-lock' },
  { id: 'Notifications', label: 'Notifikasi', icon: 'lucide:bell' },
  { id: 'Appearance', label: 'Tampilan', icon: 'lucide:palette' },
  { id: 'Language', label: 'Bahasa', icon: 'lucide:languages' },
]

const themes = [
  { id: 'system', label: 'Ikuti Sistem', icon: 'lucide:monitor' },
  { id: 'light', label: 'Mode Terang', icon: 'lucide:sun' },
  { id: 'dark', label: 'Mode Gelap', icon: 'lucide:moon' },
]

const getFlag = (code: string) => {
  switch(code) {
    case 'id': return '🇮🇩'
    case 'en': return '🇺🇸'
    case 'bali': return '🐚'
    default: return '🌐'
  }
}

const handleLocaleChange = (code: string) => {
  setLocale(code as 'id' | 'en' | 'bali')
}

const closeSecurityModal = () => {
  activeModal.value = null
  securityMode.value = 'list'
  passwordForm.value = { old: '', new: '', confirm: '' }
  passwordError.value = ''
}

const handlePasswordUpdate = async () => {
  if (passwordForm.value.new !== passwordForm.value.confirm) {
    passwordError.value = 'Konfirmasi kata sandi tidak cocok.'
    return
  }
  if (passwordForm.value.new.length < 8) {
    passwordError.value = 'Kata sandi baru minimal 8 karakter.'
    return
  }

  isUpdating.value = true
  passwordError.value = ''
  
  try {
    await updatePassword(passwordForm.value.new, passwordForm.value.old)
    // Success: reset and go back
    securityMode.value = 'list'
    passwordForm.value = { old: '', new: '', confirm: '' }
    // Optional: show a toast/notification
  } catch (e: any) {
    passwordError.value = e.message
  } finally {
    isUpdating.value = false
  }
}

const handleMfaToggle = async () => {
  try {
    await toggleMFA(mfaEnabled.value)
  } catch (e: any) {
    // Revert if failed
    mfaEnabled.value = !mfaEnabled.value
    console.error(e)
  }
}

const notifStore = useNotificationStore()
const notificationOptions = computed(() => [
  { id: 'calendar', label: 'Kalender & Pengalihan', desc: 'Info rerahinan & hari suci', enabled: notifStore.settings.calendar },
  { id: 'news', label: 'Berita Terbaru', desc: 'Informasi terkini dharma', enabled: notifStore.settings.news },
  { id: 'tips', label: 'Inspirasi Harian', desc: 'Kutipan sloka harian', enabled: notifStore.settings.tips },
])

const toggleNotif = (id: string, val: boolean) => {
  notifStore.updateSetting(id as any, val)
}
</script>

<style scoped>
.toggle {
  appearance: none;
  width: 2.5rem;
  height: 1.25rem;
  background-color: var(--state-disabled);
  border-radius: 9999px;
  position: relative;
  cursor: pointer;
  transition: all var(--transition);
  border: 1px solid var(--border-default);
}
.toggle::before {
  content: '';
  position: absolute;
  left: 2px;
  top: 2px;
  width: 1rem;
  height: 1rem;
  background-color: white;
  border-radius: 9999px;
  transition: all var(--transition);
  box-shadow: var(--shadow-sm);
}
.toggle:checked {
  background-color: var(--brand-primary);
  border-color: var(--brand-primary);
}
.toggle:checked::before {
  transform: translateX(1.25rem);
}
</style>
