    <AppGlobalSearch />
    <AppOfflineBanner />
    
    <!-- Global Offline Fallback for unsupported pages -->
    <AppOfflineFallback v-if="showOfflineFallback" />
  </div>
</template>

<script setup lang="ts">
import { useNetwork } from '@vueuse/core'

const { isDesktop } = useDevice()
const sidebarCollapsed = ref(false)
const { isOnline } = useNetwork()
const route = useRoute()

// Define routes that ARE supported offline
const offlineSupportedPrefixes = [
  '/doa-mantra',
  '/kitab-suci',
  '/berita',
  '/kalender',
  '/saved',
  '/japa-mala',
  '/ala-ayuning-dewasa'
]

const showOfflineFallback = computed(() => {
  // If online, never show fallback
  if (isOnline.value) return false
  
  // If home page, it is supported
  if (route.path === '/') return false
  
  // Check if current path matches any supported prefix
  const isSupported = offlineSupportedPrefixes.some(prefix => route.path.startsWith(prefix))
  
  return !isSupported
})
</script>
