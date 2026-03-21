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
        <h1 class="font-serif text-3xl font-bold text-default">Daftar</h1>
        <p class="text-muted mt-2">Gabung dengan komunitas Sanatana Dharma Digital</p>
      </div>

      <form @submit.prevent="handleRegister" class="space-y-4">
        <div>
          <label class="block text-xs font-bold uppercase tracking-wider text-muted mb-1.5 ml-1">Nama Lengkap</label>
          <input 
            v-model="name"
            type="text" 
            placeholder="Nama Anda"
            class="input-field"
            required
          />
        </div>

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
            placeholder="Min. 8 karakter"
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
          <span v-else>Daftar</span>
        </button>
      </form>
    </div>

    <div class="mt-8 text-center text-sm">
      <p class="text-muted">
        Sudah punya akun? 
        <NuxtLink to="/login" class="text-brand font-bold">Login Disini</NuxtLink>
      </p>
    </div>
  </div>
</template>

<script setup>
definePageMeta({ layout: false })

const { register } = useAuth()
const name = ref('')
const email = ref('')
const password = ref('')
const loading = ref(false)

const handleRegister = async () => {
  loading.value = true
  try {
    await register(email.value, password.value, name.value)
  } catch (e) {
    alert(e.message)
  } finally {
    loading.value = false
  }
}
</script>
