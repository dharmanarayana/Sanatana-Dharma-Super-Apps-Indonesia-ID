<template>
  <div v-if="show" class="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
    <div class="bg-surface w-full max-w-2xl rounded-3xl shadow-2xl border border-border mt-auto mb-auto">
      <!-- Header -->
      <div class="p-6 border-b border-border flex items-center justify-between bg-surface-variant/10 rounded-t-3xl">
        <div class="flex items-center gap-3 text-brand-primary">
          <div class="p-2 bg-brand-primary/10 rounded-lg">
            <Icon :name="item ? 'lucide:pencil' : 'lucide:plus'" size="24" />
          </div>
          <h2 class="text-xl font-bold text-default">{{ item ? 'Edit' : 'Tambah' }} {{ title }}</h2>
        </div>
        <button @click="$emit('close')" class="p-2 hover:bg-surface-variant rounded-xl transition-colors text-secondary">
          <Icon name="lucide:x" size="24" />
        </button>
      </div>

      <!-- Form -->
      <form @submit.prevent="handleSubmit" class="p-8 space-y-6 max-h-[70vh] overflow-y-auto custom-scrollbar">
        <div v-for="field in fields" :key="field.key" class="space-y-2">
          <label :for="field.key" class="block text-sm font-bold text-default uppercase tracking-wide">
            {{ field.label }} <span v-if="field.required" class="text-brand-secondary">*</span>
          </label>
          
          <!-- Text Area -->
          <textarea 
            v-if="field.type === 'textarea'"
            :id="field.key"
            v-model="formData[field.key]"
            :placeholder="field.placeholder"
            rows="5"
            :class="['w-full px-4 py-3 bg-surface-variant/5 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary transition-all resize-none', field.disabled ? 'opacity-50 cursor-not-allowed' : '']"
            :required="field.required"
            :disabled="field.disabled"
          ></textarea>

          <!-- Select -->
          <select 
            v-else-if="field.type === 'select'"
            :id="field.key"
            v-model="formData[field.key]"
            :class="['w-full px-4 py-3 bg-surface-variant/5 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary transition-all appearance-none cursor-pointer', field.disabled ? 'opacity-50 cursor-not-allowed' : '']"
            :required="field.required"
            :disabled="field.disabled"
          >
            <option value="" disabled>{{ field.placeholder || 'Pilih...' }}</option>
            <option v-for="opt in field.options" :key="opt.value" :value="opt.value">
              {{ opt.label }}
            </option>
          </select>

          <!-- Number -->
          <input 
            v-else-if="field.type === 'number'"
            :id="field.key"
            v-model.number="formData[field.key]"
            type="number"
            :placeholder="field.placeholder"
            :class="['w-full px-4 py-3 bg-surface-variant/5 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary transition-all', field.disabled ? 'opacity-50 cursor-not-allowed' : '']"
            :required="field.required"
            :disabled="field.disabled"
          />

          <!-- File -->
          <input 
            v-else-if="field.type === 'file'"
            :id="field.key"
            type="file"
            :accept="field.accept"
            @change="(e) => field.onChange && field.onChange(e, formData)"
            :class="['w-full px-4 py-2 bg-surface-variant/5 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary transition-all file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-brand-primary/10 file:text-brand-primary hover:file:bg-brand-primary/20', field.disabled ? 'opacity-50 cursor-not-allowed' : '']"
            :required="field.required"
            :disabled="field.disabled"
          />

          <!-- Default Text/Input -->
          <input 
            v-else
            :id="field.key"
            v-model="formData[field.key]"
            :type="field.type || 'text'"
            :placeholder="field.placeholder"
            :class="['w-full px-4 py-3 bg-surface-variant/5 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary transition-all', field.disabled ? 'opacity-50 cursor-not-allowed' : '']"
            :required="field.required"
            :disabled="field.disabled"
          />
        </div>
      </form>

      <!-- Footer -->
      <div class="p-6 border-t border-border bg-surface-variant/10 rounded-b-3xl flex justify-end gap-4">
        <button @click="$emit('close')" type="button" class="px-6 py-2.5 text-secondary font-bold hover:bg-surface-variant rounded-xl transition-all">
          Batal
        </button>
        <button @click="handleSubmit" type="submit" class="px-8 py-2.5 bg-brand-primary text-white font-bold rounded-xl hover:bg-brand-secondary transition-all shadow-lg shadow-brand-primary/20 flex items-center gap-2">
          <Icon name="lucide:save" size="20" />
          {{ item ? 'Simpan Perubahan' : 'Tambah Item' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  show: boolean
  title: string
  fields: any[]
  item?: any
}>()

const emit = defineEmits(['close', 'submit'])

const formData = ref<any>({})

// Initialize form data when item changes or show is triggered
watch(() => props.show, (isVisible) => {
  if (isVisible) {
    if (props.item) {
      formData.value = { ...props.item }
    } else {
      formData.value = {}
      props.fields.forEach(f => {
        if (f.default !== undefined) formData.value[f.key] = f.default
      })
    }
  }
}, { immediate: true })

const handleSubmit = () => {
  emit('submit', { ...formData.value })
}
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: var(--border-color);
  border-radius: 10px;
}
</style>
