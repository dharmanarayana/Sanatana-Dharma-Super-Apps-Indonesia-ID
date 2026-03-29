<template>
  <div class="min-h-screen bg-base flex flex-col px-6 py-6 animate-fade-up relative text-default">
    <!-- Back Button -->
    <div class="absolute top-6 left-6 z-10">
      <NuxtLink to="/" class="group flex items-center gap-1.5 px-4 py-2 bg-surface/50 backdrop-blur-md rounded-full border border-default shadow-sm hover:bg-surface transition-all active:scale-95">
        <Icon name="lucide:chevron-left" class="w-4 h-4 text-brand transition-colors" />
        <span class="text-xs font-bold text-brand transition-colors">Kembali</span>
      </NuxtLink>
    </div>

    <div class="flex-grow flex flex-col justify-center mt-12">
      <div class="mb-10 text-center">
        <span class="text-6xl mb-4 block">🕉️</span>
        <h1 class="font-serif text-3xl font-bold text-default">Masuk</h1>
        <p class="text-muted mt-2">Masuk ke akun Sanatana Dharma Digital Anda</p>
      </div>

      <form @submit.prevent="handleLogin" class="space-y-4">
        <div>
          <label class="block text-xs font-bold uppercase tracking-wider text-muted mb-1.5 ml-1">Email</label>
          <input 
            v-model="email"
            type="email" 
            placeholder="nama@email.com"
            class="input-field"
            required
          />
        </div>
        
        <div>
          <label class="block text-xs font-bold uppercase tracking-wider text-muted mb-1.5 ml-1">Kata Sandi</label>
          <input 
            v-model="password"
            type="password" 
            placeholder="••••••••"
            class="input-field"
            required
          />
        </div>

        <button 
          type="submit"
          :disabled="loading"
          class="btn-primary w-full py-4 justify-center disabled:opacity-50"
        >
          <span v-if="loading">Memuat...</span>
          <span v-else>Masuk</span>
        </button>
      </form>

      <div class="relative my-8">
        <div class="absolute inset-0 flex items-center"><div class="divider"></div></div>
        <div class="relative flex justify-center text-xs uppercase"><span class="bg-base px-2 text-muted">Atau masuk dengan</span></div>
      </div>

      <div class="flex flex-col sm:flex-row gap-3">
        <button 
          @click="loginWithGoogle"
          class="flex-1 bg-surface border border-default text-default font-medium py-3 rounded-xl flex items-center justify-center gap-3 hover:bg-[var(--state-hover)] transition-all"
        >
          <Icon name="logos:google-icon" class="w-5 h-5" />
          Google
        </button>

        <button 
          @click="loginWithFacebook"
          class="flex-1 bg-[#1877F2] border border-[#1877F2] text-white font-medium py-3 rounded-xl flex items-center justify-center gap-3 hover:opacity-90 transition-all"
        >
          <Icon name="logos:facebook" class="w-5 h-5 brightness-0 invert" />
          Facebook
        </button>
      </div>
    </div>

    <div class="mt-8 text-center text-sm">
      <p class="text-muted">
        Belum punya akun? 
        <NuxtLink to="/register" class="text-brand font-bold">Daftar Sekarang</NuxtLink>
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: false })

useSeoMeta({
  title: 'Masuk',
  ogTitle: 'Masuk ke Akun Sanatana Dharma Digital',
  description: 'Masuk ke akun Anda untuk mengakses fitur lengkap Sanatana Dharma Digital.',
})

const { login, loginWithGoogle, loginWithFacebook } = useAuth()
const route = useRoute()
const router = useRouter()
const email = ref('')
const password = ref('')
const loading = ref(false)

onMounted(() => {
  // Handle OAuth errors from URL
  const errorQuery = route.query.error
  if (errorQuery) {
    try {
      const errorStr = Array.isArray(errorQuery) ? errorQuery[0] : errorQuery
      if (errorStr) {
        const errorData = JSON.parse(errorStr)
        const message = errorData.message || 'Gagal masuk dengan OAuth.'
        
        // Map common Appwrite error messages to Indonesian
        let friendlyMessage = message
        if (message.toLowerCase().includes('failed to return email')) {
          friendlyMessage = 'Penyedia layanan (Google/Facebook) gagal memberikan alamat email Anda. Pastikan Anda telah memberikan izin akses email pada akun Anda atau coba metode masuk lain.'
        } else if (message.toLowerCase().includes('user_unauthorized')) {
          friendlyMessage = 'Otorisasi gagal atau dibatalkan.'
        }

        alert(`⚠️ Terjadi Kesalahan: ${friendlyMessage}`)
        
        // Clear the error from URL to prevent alert showing again on refresh
        router.replace({ query: { ...route.query, error: undefined } })
      }
    } catch (e) {
      console.error('Failed to parse auth error:', e)
    }
  }
})

const handleLogin = async () => {
  loading.value = true
  try {
    await login(email.value, password.value)
  } catch (e) {
    alert(e.message)
  } finally {
    loading.value = false
  }
}
</script>
