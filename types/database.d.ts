import type { DataService } from '../lib/data-service'

declare module '#app' {
  interface NuxtApp {
    $db: DataService
  }
}

declare module 'vue' {
  interface ComponentCustomProperties {
    $db: DataService
  }
}

export {}
