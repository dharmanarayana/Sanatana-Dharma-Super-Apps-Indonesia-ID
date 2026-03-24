<!-- components/app/AppMenuOverlay.vue -->
<script setup lang="ts">
defineProps<{
  show: boolean
}>()

const emit = defineEmits(['close'])

const authStore = useAuthStore()

const menuItems = computed(() => {
  const items = [
    { label: 'nav.kalender', icon: 'lucide:calendar', color: 'text-blue-500', path: '/kalender' },
    { label: 'nav.doa_mantra', icon: 'lucide:scroll-text', color: 'text-green-500', path: '/doa-mantra' },
    { label: 'nav.pura', icon: 'lucide:book-open', color: 'text-purple-500', path: '/kitab-suci' }, // Kitab
    { label: 'nav.tersimpan', icon: 'lucide:bookmark', color: 'text-brand', path: '/tersimpan', auth: true },
    { label: 'nav.toko', icon: 'lucide:shopping-bag', color: 'text-orange-500', path: '/marketplace' },
    { label: 'nav.video', icon: 'lucide:clapperboard', color: 'text-yellow-500', path: '/video' },
    { label: 'nav.pura', icon: 'lucide:map-pin', color: 'text-emerald-500', path: '/pura' },
    { label: 'nav.donasi', icon: 'lucide:heart', color: 'text-red-500', path: '/donasi' },
    { label: 'nav.sarana', icon: 'lucide:sparkles', color: 'text-amber-500', path: '/sarana-upacara' },
    { label: 'nav.library', icon: 'lucide:library', color: 'text-indigo-500', path: '/e-library' },
    { label: 'nav.galeri', icon: 'lucide:image', color: 'text-pink-500', path: '/galeri' },
    { label: 'nav.berita', icon: 'lucide:newspaper', color: 'text-slate-500', path: '/berita' },
    { label: 'nav.sosial', icon: 'lucide:message-square', color: 'text-cyan-500', path: '/forum' },
  ]
  
  return items.filter(item => !item.auth || authStore.isLoggedIn)
})

const close = () => emit('close')
</script>

<template>
  <ClientOnly>
    <Teleport to="body">
      <Transition name="fade">
        <div v-if="show" class="fixed inset-0 z-50 flex flex-col items-center justify-end">
          <!-- Backdrop -->
          <div class="absolute inset-0 bg-black/40 backdrop-blur-md" @click="close"></div>

          <!-- Menu Card -->
          <div class="relative w-full max-w-lg bg-surface rounded-t-[40px] p-8 shadow-2xl animate-slide-up">
            <div class="flex items-center justify-between mb-8">
              <h3 class="text-xl font-bold text-default font-serif">{{ $t('nav.select_service') }}</h3>
              <button @click="close" class="p-2 rounded-full bg-default/5 hover:bg-default/10 transition-colors">
                <Icon name="lucide:x" class="w-6 h-6 text-muted" />
              </button>
            </div>

            <div class="grid grid-cols-4 gap-y-8 gap-x-4">
              <NuxtLink v-for="item in menuItems" 
                        :key="item.path" 
                        :to="item.path"
                        @click="close"
                        class="flex flex-col items-center group active:scale-95 transition-all">
                <div class="w-16 h-16 rounded-[20px] bg-surface border border-default shadow-sm 
                            flex items-center justify-center mb-2 group-hover:border-brand transition-colors">
                  <Icon :name="item.icon" class="w-9 h-9" :class="item.color" />
                </div>
                <span class="text-[11px] font-bold text-default text-center leading-tight">
                  {{ $t(item.label) }}
                </span>
              </NuxtLink>
            </div>

            <div class="mt-10 flex justify-center">
              <div class="w-12 h-1.5 bg-default/10 rounded-full"></div>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </ClientOnly>
</template>

<style scoped>
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}

.animate-slide-up {
  animation: slide-up 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}

@keyframes slide-up {
  from { transform: translateY(100%); }
  to { transform: translateY(0); }
}
</style>
