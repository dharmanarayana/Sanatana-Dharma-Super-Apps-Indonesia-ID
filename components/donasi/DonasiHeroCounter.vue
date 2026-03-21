<template>
  <div class="card p-6 bg-brand text-white text-center shadow-lg shadow-brand/20">
    <p class="text-[10px] uppercase font-bold opacity-80 mb-1 tracking-widest">Total Dana Terkumpul</p>
    <h3 class="text-3xl font-black italic">Rp {{ totalFunds.toLocaleString('id-ID') }}</h3>
    <p class="text-[10px] mt-2 opacity-60 font-bold uppercase tracking-tighter">Membantu sesama dan mendukung tempat suci</p>
  </div>
</template>

<script setup lang="ts">
const { $appwrite } = useNuxtApp()
const DB_ID = 'sanatana-dharma-db'
const totalFunds = ref(0)

const fetchTotal = async () => {
  try {
    const res = await $appwrite.databases.listDocuments(DB_ID, 'donations')
    totalFunds.value = res.documents.reduce((acc, curr) => acc + Number(curr.collected || 0), 0)
  } catch (e: any) {
    console.error('Error fetching total donations:', e.message)
  }
}

onMounted(fetchTotal)
</script>
