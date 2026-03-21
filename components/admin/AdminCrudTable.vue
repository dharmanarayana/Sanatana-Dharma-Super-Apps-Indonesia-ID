<template>
  <div class="bg-surface rounded-2xl border border-border overflow-hidden shadow-sm">
    <div class="p-6 border-b border-border flex flex-col md:flex-row md:items-center justify-between gap-4 bg-surface-variant/10">
      <div class="relative flex-1 max-w-md">
        <Icon name="lucide:search" class="absolute left-3 top-1/2 -translate-y-1/2 text-secondary" size="18" />
        <input 
          v-model="search"
          type="text" 
          :placeholder="`Cari ${title}...`" 
          class="w-full pl-10 pr-4 py-2 bg-surface border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary"
        />
      </div>
      <button @click="$emit('add')" class="flex items-center gap-2 px-6 py-2 bg-brand-primary text-white rounded-xl font-bold hover:bg-brand-secondary transition-all shadow-md shadow-brand-primary/20">
        <Icon name="lucide:plus" size="20" />
        Tambah {{ title }}
      </button>
    </div>

    <div class="overflow-x-auto">
      <table class="w-full text-left border-collapse">
        <thead class="bg-surface-variant/30">
          <tr>
            <th v-for="col in columns" :key="col.key" class="px-6 py-4 text-xs font-bold text-secondary uppercase tracking-wider border-b border-border">
              {{ col.label }}
            </th>
            <th class="px-6 py-4 text-xs font-bold text-secondary uppercase tracking-wider border-b border-border text-right">
              Aksi
            </th>
          </tr>
        </thead>
        <tbody class="divide-y divide-border">
          <tr v-for="item in filteredItems" :key="item.$id" class="hover:bg-surface-variant/10 transition-colors group">
            <td v-for="col in columns" :key="col.key" class="px-6 py-4 text-default">
              <slot :name="`col-${col.key}`" :item="item" :value="item[col.key]">
                <span class="line-clamp-1">{{ item[col.key] }}</span>
              </slot>
            </td>
            <td class="px-6 py-4 text-right">
              <div class="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button @click="$emit('edit', item)" class="p-2 text-blue-500 hover:bg-blue-500/10 rounded-lg transition-colors" title="Edit">
                  <Icon name="lucide:pencil" size="18" />
                </button>
                <button @click="$emit('delete', item)" class="p-2 text-red-500 hover:bg-red-500/10 rounded-lg transition-colors" title="Hapus">
                  <Icon name="lucide:trash-2" size="18" />
                </button>
              </div>
            </td>
          </tr>
          <tr v-if="filteredItems.length === 0">
            <td :colspan="columns.length + 1" class="px-6 py-12 text-center text-secondary">
              <div class="flex flex-col items-center gap-3">
                <Icon name="lucide:box-select" size="48" class="opacity-20" />
                <p>Tidak ada data ditemukan.</p>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-if="filteredItems.length > 0" class="p-4 border-t border-border bg-surface-variant/5 text-right text-xs text-secondary italic">
      Menampilkan {{ filteredItems.length }} data.
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  title: string
  items: any[]
  columns: { key: string; label: string }[]
}>()

defineEmits(['add', 'edit', 'delete'])

const search = ref('')

const filteredItems = computed(() => {
  if (!search.value) return props.items
  const s = search.value.toLowerCase()
  return props.items.filter(item => {
    return Object.values(item).some(val => 
      String(val).toLowerCase().includes(s)
    )
  })
})
</script>
