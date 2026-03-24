<script setup lang="ts">
const authStore = useAuthStore()
const { logout } = useAuth()

const menuItems = [
  { label: 'Dashboard', icon: 'lucide:layout-dashboard', path: '/merchant' },
  { label: 'Produk Saya', icon: 'lucide:package', path: '/merchant/produk' },
  { label: 'Pesanan', icon: 'lucide:shopping-cart', path: '/merchant/pesanan' },
  { label: 'Pengaturan Toko', icon: 'lucide:settings', path: '/merchant/pengaturan' },
]

const route = useRoute()
const isActive = (path: string) => route.path === path || (path !== '/merchant' && route.path.startsWith(path))
</script>

<template>
  <div class="min-h-screen bg-surface flex">
    <!-- Merchant Sidebar -->
    <aside class="w-64 border-r border-default bg-surface sticky top-0 h-screen flex flex-col shrink-0 overflow-hidden">
      <div class="p-6 border-b border-default flex items-center gap-3">
        <div class="w-10 h-10 rounded-xl bg-brand flex items-center justify-center text-white shadow-lg shadow-brand/20">
          <Icon name="lucide:store" class="w-6 h-6" />
        </div>
        <div>
          <h1 class="font-bold text-default leading-none">Merchant Hub</h1>
          <p class="text-[10px] text-muted uppercase tracking-widest mt-1 font-bold">Sanatana Dharma</p>
        </div>
      </div>

      <nav class="flex-1 p-4 space-y-1">
        <NuxtLink 
          v-for="item in menuItems" 
          :key="item.path"
          :to="item.path"
          :class="[
            'flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group',
            isActive(item.path) 
              ? 'bg-brand text-white shadow-md shadow-brand/10' 
              : 'text-secondary hover:bg-default/5 hover:text-default'
          ]"
        >
          <Icon :name="item.icon" class="w-5 h-5" :class="isActive(item.path) ? 'text-white' : 'text-muted group-hover:text-brand'" />
          <span class="font-bold text-sm">{{ item.label }}</span>
        </NuxtLink>
      </nav>

      <div class="p-4 border-t border-default space-y-2">
        <NuxtLink to="/sarana-upacara" class="flex items-center gap-3 px-4 py-2 text-sm text-secondary hover:text-brand transition-colors">
          <Icon name="lucide:arrow-left" class="w-4 h-4" />
          Lihat Toko Publik
        </NuxtLink>
        <button @click="logout" class="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-500 hover:bg-red-50 transition-all rounded-lg font-bold">
          <Icon name="lucide:log-out" class="w-4 h-4" />
          Keluar Account
        </button>
      </div>
    </aside>

    <!-- Main Content -->
    <div class="flex-1 flex flex-col min-w-0">
      <header class="h-16 border-b border-default bg-surface/80 backdrop-blur-md sticky top-0 z-30 px-8 flex items-center justify-between">
        <div class="flex items-center gap-2">
           <span class="text-xs font-bold text-muted uppercase tracking-widest">Hi, {{ authStore.user?.name }}</span>
        </div>
        <div class="flex items-center gap-4">
          <AppNotificationBell />
          <div class="w-8 h-8 rounded-full bg-brand/10 flex items-center justify-center border border-brand/20">
            <Icon name="lucide:user" class="w-4 h-4 text-brand" />
          </div>
        </div>
      </header>

      <main class="flex-1 p-8 overflow-y-auto">
        <slot />
      </main>
    </div>
  </div>
</template>
