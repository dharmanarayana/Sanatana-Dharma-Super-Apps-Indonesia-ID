<template>
  <div>
    <UiPageHeader icon="🕌" title="Daftar Pura"
                  subtitle="Temukan tempat suci di sekitar Anda"
                  back-path="/" />
    <div class="px-4 lg:px-0 py-4 grid lg:grid-cols-[280px_1fr] gap-8">
      <!-- Filter Sidebar Desktop -->
      <aside class="hidden lg:block space-y-6">
        <div class="card p-4">
          <h4 class="card-label mb-3 text-muted text-[10px]">Filter Lokasi</h4>
          <div class="space-y-4">
            <div class="relative">
              <input type="text" placeholder="Cari Kota/Kab..." class="input-field text-xs pl-8 h-10" />
              <span class="absolute left-2.5 top-1/2 -translate-y-1/2 opacity-30 text-xs">🔍</span>
            </div>
            <div class="space-y-2">
              <label v-for="r in ['Bali', 'Jawa Timur', 'Jawa Tengah', 'Kalimantan']" :key="r"
                     class="flex items-center gap-2 text-xs font-medium cursor-pointer hover:text-brand">
                <input type="checkbox" class="rounded border-default text-brand" />
                {{ r }}
              </label>
            </div>
          </div>
        </div>
        <button class="btn-primary w-full py-4 justify-center gap-2 bg-charcoal text-white hover:bg-black">
          <span>🗺️</span> Lihat di Peta
        </button>
      </aside>

      <div class="space-y-6">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-default pb-3">
          <div class="relative flex-1 max-w-sm">
            <input type="text" placeholder="Cari nama Pura..." class="input-field pl-9 h-11" />
            <span class="absolute left-3 top-1/2 -translate-y-1/2 opacity-30">🕌</span>
          </div>
          <select class="bg-surface border border-default rounded-xl px-4 py-2 text-xs font-bold outline-none focus:border-brand">
            <option>Paling Populer</option>
            <option>Terdekat</option>
            <option>A-Z</option>
          </select>
        </div>

        <UiGrid v-if="temples.length > 0" cols="2" gap="md">
          <PuraCard v-for="temple in temples" :key="temple.$id" :temple="temple" />
        </UiGrid>
        <div v-else class="py-20 text-center card bg-surface/30 border-dashed">
          <p class="text-muted text-sm">Data Pura belum tersedia untuk kriteria ini.</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const { $appwrite } = useNuxtApp()
const DB_ID = 'sanatana-dharma-db'
const temples = ref<any[]>([])

const fetchTemples = async () => {
  try {
    const res = await $appwrite.databases.listDocuments(DB_ID, 'temples', [
      useAppwriteQuery().orderAsc('name')
    ])
    temples.value = res.documents
  } catch (e: any) {
    console.error('Error fetching temples:', e.message)
  }
}

onMounted(fetchTemples)
</script>
