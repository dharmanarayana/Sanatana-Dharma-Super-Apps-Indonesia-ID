<template>
  <div class="min-h-screen pb-20">
    <!-- Pura Not Found State -->
    <div v-if="!loading && !temple" class="max-w-xl mx-auto mt-20 px-6 text-center">
      <div class="w-24 h-24 bg-brand/10 rounded-3xl flex items-center justify-center text-brand mx-auto mb-8">
        <Icon name="lucide:search-x" size="48" />
      </div>
      <h2 class="text-3xl font-black italic tracking-tight mb-4 text-default">Pura Tidak Ditemukan</h2>
      <p class="text-muted mb-8 italic">
        Maaf, data Pura yang Anda cari tidak tersedia atau mungkin telah diperbarui. 
        Silakan kembali ke daftar Pura untuk mencari data terbaru.
      </p>
    </div>

    <template v-else>
      <!-- Back Button (Desktop) -->
      <!-- Back Button (Desktop) -->
      <div class="hidden lg:block fixed top-20 left-64 z-50">
        <button @click="$router.back()" 
                class="flex items-center gap-2 px-4 py-2 bg-surface border border-default rounded-xl text-default font-bold hover:text-brand hover:border-brand transition-all shadow-lg active:scale-95">
          <Icon name="lucide:arrow-left" size="18" />
          <span>Kembali</span>
        </button>
      </div>

      <!-- Hero / Header Section -->
      <div class="relative h-[40vh] md:h-[50vh] overflow-hidden group bg-brand/5 flex items-center justify-center">
        <img 
          v-if="temple?.image"
          :src="temple.image" 
          class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 absolute inset-0 z-10"
          @error="(e: any) => e.target.style.display = 'none'"
        />
        <div class="flex flex-col items-center justify-center text-brand/20 relative z-0">
          <Icon name="fa6-solid:om" size="120" />
          <span class="text-xl font-black italic mt-4 uppercase tracking-[0.2em] opacity-50">Sanatana Dharma</span>
        </div>
        <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-20"></div>
        
        <div class="absolute bottom-0 left-0 right-0 p-6 md:p-12 text-white z-30">
          <div class="max-w-6xl mx-auto space-y-4">
            <div class="flex flex-wrap items-center gap-3">
               <span class="px-3 py-1 bg-brand text-white text-[10px] font-bold uppercase rounded-full tracking-wider">
                 PURA HINDU
               </span>
               <span v-if="temple?.province" class="px-3 py-1 bg-white/10 text-white text-[10px] font-bold uppercase rounded-full tracking-wider border border-white/20 backdrop-blur-sm">
                 {{ temple.province }}
               </span>
            </div>
            
            <h1 class="text-4xl md:text-6xl font-black italic tracking-tighter">{{ temple?.name || 'Loading...' }}</h1>
            
            <p v-if="temple" class="flex items-center gap-2 text-white/80 text-sm md:text-base">
              <Icon name="lucide:map-pin" size="18" class="text-brand" />
              {{ temple?.address ? `${temple.address}, ` : '' }} {{ temple?.city ? `${temple.city}, ` : '' }} {{ temple?.province }}
            </p>
          </div>
        </div>
      </div>

      <!-- Content Section (only if temple loaded) -->
      <div v-if="temple" class="max-w-6xl mx-auto px-6 mt-12 grid lg:grid-cols-[1fr_350px] gap-12">
        <!-- Main Info -->
        <article class="space-y-12">
          <section v-if="temple?.description" class="space-y-4">
            <div class="flex items-center gap-3 mb-6">
              <div class="w-10 h-10 rounded-xl bg-brand/10 flex items-center justify-center text-brand">
                 <Icon name="lucide:info" size="20" />
              </div>
              <h2 class="text-2xl font-black italic tracking-tight">Tentang Pura</h2>
            </div>
            <div class="prose prose-p:text-muted prose-p:leading-relaxed max-w-none">
              <p>{{ temple.description }}</p>
            </div>
          </section>

          <section v-if="temple?.history" class="space-y-4">
            <div class="flex items-center gap-3 mb-6">
              <div class="w-10 h-10 rounded-xl bg-brand/10 flex items-center justify-center text-brand">
                 <Icon name="lucide:history" size="20" />
              </div>
              <h2 class="text-2xl font-black italic tracking-tight">Sejarah & Filosofi</h2>
            </div>
            <div class="prose prose-p:text-muted prose-p:leading-relaxed max-w-none bg-surface p-8 rounded-2xl border border-default italic">
               "{{ temple.history }}"
            </div>
          </section>

          <!-- Google Maps Embed -->
          <section class="space-y-6">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-xl bg-brand/10 flex items-center justify-center text-brand">
                   <Icon name="lucide:map" size="20" />
                </div>
                <h2 class="text-2xl font-black italic tracking-tight">Lokasi di Peta</h2>
              </div>
              <button @click="openExternalMaps" class="text-brand text-xs font-bold hover:underline flex items-center gap-1">
                Buka di Aplikasi Google Maps <Icon name="lucide:external-link" size="12" />
              </button>
            </div>
            
            <div class="h-[400px] w-full rounded-2xl overflow-hidden shadow-2xl bg-muted border-4 border-white">
              <iframe
                v-if="mapUrl"
                width="100%"
                height="100%"
                style="border:0"
                loading="lazy"
                allowfullscreen
                referrerpolicy="no-referrer-when-downgrade"
                :src="mapUrl"
              ></iframe>
              <div v-else class="w-full h-full flex flex-col items-center justify-center text-muted gap-2">
                 <Icon name="lucide:map-pin-off" size="48" class="opacity-20" />
                 <p class="text-sm font-medium">Lokasi peta belum tersedia</p>
              </div>
            </div>
          </section>
        </article>

        <!-- Sidebar / Quick Info -->
        <aside class="space-y-8">
          <div class="card p-6 border-brand/20 bg-brand/[0.02]">
            <h3 class="text-sm font-black italic mb-6 border-b border-brand/10 pb-2">INFORMASI CEPAT</h3>
            
            <div class="space-y-6">
              <div class="flex gap-4">
                <Icon name="lucide:map-pin" class="text-brand shrink-0" size="20" />
                <div>
                  <p class="text-[10px] text-muted font-bold uppercase tracking-widest">Alamat</p>
                  <p class="text-sm font-bold text-default">{{ temple?.address || '-' }}</p>
                </div>
              </div>

              <div class="flex gap-4">
                <Icon name="lucide:navigation" class="text-brand shrink-0" size="20" />
                <div>
                  <p class="text-[10px] text-muted font-bold uppercase tracking-widest">Wilayah</p>
                  <p class="text-sm font-bold text-default">{{ temple?.city }}, {{ temple?.province }}</p>
                </div>
              </div>

              <div class="flex gap-4">
                <Icon name="lucide:compass" class="text-brand shrink-0" size="20" />
                <div>
                  <p class="text-[10px] text-muted font-bold uppercase tracking-widest">Koordinat</p>
                  <p class="text-xs font-mono font-medium text-default">
                    {{ temple?.latitude?.toFixed(5) || '-' }}, {{ temple?.longitude?.toFixed(5) || '-' }}
                  </p>
                </div>
              </div>
            </div>

            <div class="mt-8 pt-6 border-t border-brand/10">
              <button @click="sharePura" class="w-full btn-primary bg-charcoal text-white justify-center gap-2 py-3">
                <Icon name="lucide:share-2" size="16" />
                Bagikan Pura
              </button>
            </div>
          </div>

          <div class="card p-4 text-center">
             <p class="text-[10px] text-muted leading-relaxed">
               Data ini dihimpun dari database Sanatana Dharma & Kemenag RI. Nama dan lokasi mungkin memerlukan verifikasi lapangan. 
               Jika Anda ingin membantu menambahkan detail atau koreksi, silakan hubungi admin di 
               <a href="mailto:admin@sanatanadharma.me" class="text-brand hover:underline font-bold">admin@sanatanadharma.me</a>. Terima kasih.
             </p>
          </div>
        </aside>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
const { $appwrite } = useNuxtApp()
const DB_ID = 'sanatana-dharma-db'
const COLL_ID = 'temples'

const temple = ref<any>(null)
const loading = ref(true)

const fetchTempleDetail = async () => {
    loading.value = true
    try {
        const response = await $appwrite.databases.listDocuments(DB_ID, COLL_ID, [
            useAppwriteQuery().equal('slug', route.params.id as string)
        ])
        if (response.documents.length > 0) {
            temple.value = response.documents[0]
            useSeoMeta({
              title: `${temple.value.name}`,
              ogTitle: `${temple.value.name}`,
              description: `Pelajari sejarah, lokasi, dan informasi lengkap mengenai ${temple.value.name} yang terletak di ${temple.value.city}, ${temple.value.province}. Platform Sanatana Dharma membantu Anda menemukan pura terdekat dan panduan spiritual Hindu.`,
              ogDescription: `Pelajari sejarah, lokasi, dan informasi lengkap mengenai ${temple.value.name} yang terletak di ${temple.value.city}, ${temple.value.province}.`,
              ogImage: temple.value.image,
              twitterCard: 'summary_large_image',
              twitterTitle: `${temple.value.name}`,
              twitterDescription: `Informasi lengkap mengenai ${temple.value.name} di ${temple.value.city}, ${temple.value.province}.`,
              twitterImage: temple.value.image,
            })
            useBreadcrumbs().setBreadcrumbLabel(route.params.id as string, temple.value.name)
        } else {
            temple.value = null
        }
    } catch (e: any) {
        console.error('Error fetching temple:', e.message)
        temple.value = null
    } finally {
        loading.value = false
    }
}

const mapUrl = computed(() => {
    if (!temple.value) return null
    
    const { name, province, latitude, longitude } = temple.value
    let query = (name + ' ' + (province || '')).trim().replace(/\s+/g, '+')
    
    if (latitude && longitude && Number(latitude) !== 0) {
        query += `+${latitude},${longitude}`
    }
    
    // Using standard embed URL format
    return `https://maps.google.com/maps?q=${query}&hl=id&z=15&t=&ie=UTF8&iwloc=B&output=embed`
})

const openExternalMaps = () => {
    if (!temple.value) return
    const { name, province, latitude, longitude } = temple.value
    const nameQuery = (name + ' ' + (province || '')).trim().replace(/\s+/g, '+')
    let url = `https://www.google.com/maps/search/${nameQuery}`
    
    if (latitude && longitude && Number(latitude) !== 0) {
        url += `/@${latitude},${longitude},17z`
    }
    
    window.open(url, '_blank')
}

const sharePura = () => {
    if (navigator.share) {
        navigator.share({
            title: temple.value.name,
            text: `Detail ${temple.value.name} di Sanatana Dharma Super App`,
            url: window.location.href
        })
    } else {
        navigator.clipboard.writeText(window.location.href)
        alert('Link berhasil disalin!')
    }
}

onMounted(fetchTempleDetail)
</script>

<style scoped>
.prose-p\:text-muted p {
  color: var(--color-muted);
}
</style>
