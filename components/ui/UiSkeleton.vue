<template>
  <div :class="['skeleton-base', shapeClass, shimmer ? 'shimmer' : '']" :style="styles"></div>
</template>

<script setup lang="ts">
interface Props {
  width?: string
  height?: string
  radius?: string
  circle?: boolean
  shimmer?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  width: '100%',
  height: '1rem',
  radius: '0.5rem',
  shimmer: true
})

const shapeClass = computed(() => props.circle ? 'skeleton-circle' : 'skeleton-rect')

const styles = computed(() => ({
  width: props.width,
  height: props.height,
  borderRadius: props.circle ? '50%' : props.radius
}))
</script>

<style scoped>
.skeleton-base {
  background-color: var(--surface-hover, #eee);
  position: relative;
  overflow: hidden;
}

.shimmer::after {
  content: '';
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  transform: translateX(-100%);
  background-image: linear-gradient(
    90deg,
    rgba(255, 255, 255, 0) 0,
    rgba(255, 255, 255, 0.2) 20%,
    rgba(255, 255, 255, 0.5) 60%,
    rgba(255, 255, 255, 0)
  );
  animation: shimmer 2s infinite;
}

@keyframes shimmer {
  100% {
    transform: translateX(100%);
  }
}
</style>
