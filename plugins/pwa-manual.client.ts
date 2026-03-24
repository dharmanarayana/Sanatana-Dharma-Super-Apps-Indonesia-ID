export default defineNuxtPlugin(() => {
  if (import.meta.client && 'serviceWorker' in navigator) {
    const { $pwa } = useNuxtApp() as any
    
    // Fallback registration if $pwa is not available (though it should be)
    if (!$pwa) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js', { scope: '/' })
          .then(reg => {
            console.log('✅ Manual SW registration successful with scope:', reg.scope)
          })
          .catch(err => {
            console.error('❌ Manual SW registration failed:', err)
          })
      })
    }
  }
})
