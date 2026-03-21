<template>
  <NuxtLink :to="menu.path" class="flex flex-col items-center gap-1.5 group active:scale-95 transition-all">
    <div :class="[menu.color, 'w-14 h-14 lg:w-16 lg:h-16 rounded-xl shadow-md flex items-center justify-center text-white relative overflow-hidden transition-transform group-hover:-translate-y-1']">
      <!-- Inner Glow -->
      <div class="absolute inset-x-0 top-0 h-1/2 bg-white/20 blur-sm pointer-events-none"></div>
      
      <Icon :name="menu.iconComp || menu.icon" class="w-7 h-7 lg:w-8 lg:h-8" />
    </div>
    <span class="text-[10px] lg:text-xs font-bold text-default text-center leading-tight">
      {{ menu.label }}
    </span>
  </NuxtLink>
</template>

<script setup>
defineProps({
  menu: {
    type: Object,
    required: true
  }
})
</script>
