<template>
  <div>
    <UiPageHeader icon="👤" title="Profil Saya"
                  subtitle="Informasi akun & pengaturan"
                  back-path="/" />
    <div class="px-4 lg:px-0 py-4">
      <div v-if="authStore.isLoggedIn" class="grid lg:grid-cols-2 gap-8">
        <div class="space-y-6">
          <ProfilAvatarCard :level="level" :rank="rank" />
          <div v-if="loading" class="h-20 animate-pulse bg-muted/20 rounded-2xl"></div>
          <ProfilStatistik v-else :stats="stats" />
          <ProfilBadge />
        </div>
        <aside class="space-y-6">
          <h4 class="card-label px-1 text-muted text-[10px]">PENGATURAN & APLIKASI</h4>
          <ProfilPengaturan />
          
          <!-- Admin Dashboard Link -->
          <NuxtLink v-if="authStore.isAdmin" 
                    to="/admin" 
                    class="w-full flex items-center justify-between p-4 bg-brand-primary text-white font-bold rounded-2xl border border-brand-primary/20 hover:shadow-lg hover:shadow-brand-primary/20 transition-all active:scale-[0.98] group">
            <div class="flex items-center gap-3">
              <Icon name="lucide:shield-check" size="20" />
              ADMIN DASHBOARD
            </div>
            <Icon name="lucide:chevron-right" size="20" class="group-hover:translate-x-1 transition-transform" />
          </NuxtLink>

          <button @click="handleLogout" class="w-full py-4 text-error font-black italic bg-error/5 rounded-2xl border border-error/10 hover:bg-error/10 transition-all active:scale-[0.98]">
            KELUAR AKUN 🚪
          </button>
        </aside>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: 'auth'
})

const authStore = useAuthStore()
const { refreshUserSession, logout } = useAuth()
const { stats, loading, level, rank, fetchUserStats } = useProfile()

onMounted(async () => {
  // Force refresh session to get latest Prefs from Console edits
  const session = await refreshUserSession()
  
  if (session) {
    await fetchUserStats()
  }
})

const handleLogout = async () => {
  if (confirm('Apakah Anda yakin ingin keluar?')) {
    await logout()
  }
}
</script>
