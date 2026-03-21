<template>
  <div class="card overflow-hidden group cursor-pointer hover:border-brand/30 transition-all">
    <div class="aspect-video bg-charcoal relative overflow-hidden">
      <img v-if="video.thumbnail" :src="video.thumbnail" class="w-full h-full object-cover opacity-80 group-hover:scale-110 transition-transform duration-500" />
      <div class="absolute inset-0 flex items-center justify-center">
        <div class="w-12 h-12 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center group-hover:bg-brand group-hover:scale-110 transition-all shadow-xl">
          <Icon name="lucide:play" class="text-white ml-1" size="24" />
        </div>
      </div>
      <div class="absolute bottom-2 right-2 px-2 py-1 bg-black/60 text-[10px] font-bold text-white rounded">
        VIDEO
      </div>
    </div>
    <div class="p-4">
      <span class="text-[10px] font-bold text-brand bg-brand/10 px-2 py-0.5 rounded uppercase mb-2 inline-block">
        {{ video.category }}
      </span>
      <h4 class="font-bold text-default line-clamp-2 leading-snug group-hover:text-brand transition-colors">
        {{ video.title }}
      </h4>
      <p v-if="video.description" class="text-[10px] text-muted mt-2 line-clamp-1">
        {{ video.description }}
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  video: any
}>()
</script>
