<template>
  <div>
    <UiPageHeader icon="📖" title="Kitab Suci Digital"
                  subtitle="Weda, Gita, Ramayana & lebih banyak lagi"
                  back-path="/" />
    <div class="px-4 lg:px-0 py-4">
      <UiGrid v-if="kitabList.length > 0" cols="4" gap="md">
        <KitabCard v-for="k in kitabList" :key="k.$id" :kitab="k" />
      </UiGrid>
      <div v-else class="text-center py-20 opacity-40 italic">
        Belum ada kitab suci yang terdaftar.
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const { $appwrite } = useNuxtApp()
const DB_ID = 'sanatana-dharma-db'
const kitabList = ref<any[]>([])

const fetchKitab = async () => {
  try {
    const res = await $appwrite.databases.listDocuments(DB_ID, 'holy_books', [
      useAppwriteQuery().orderAsc('title')
    ])
    kitabList.value = res.documents
  } catch (e: any) {
    console.error('Error fetching books:', e.message)
  }
}

onMounted(fetchKitab)
</script>
