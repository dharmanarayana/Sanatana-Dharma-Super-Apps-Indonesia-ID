<template>
  <NuxtLink :to="menu.path" class="flex flex-col items-center gap-2 group active:scale-90 transition-all">
    <div :class="[menu.color, 'w-[72px] h-[72px] rounded-[28px] shadow-[0_10px_20px_rgba(0,0,0,0.08)] flex items-center justify-center text-white relative overflow-hidden transition-all group-hover:-translate-y-1.5 group-hover:shadow-[0_15px_30px_rgba(0,0,0,0.12)]']">
      <!-- Soft Light Overlay -->
      <div class="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
      
      <Icon :name="menu.iconComp || menu.icon" class="w-8 h-8 relative z-10" />
    </div>
    <span class="text-sm font-bold text-default text-center leading-tight opacity-90 group-hover:opacity-100 transition-opacity">
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
