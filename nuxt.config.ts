import tailwindcss from "@tailwindcss/vite";

// nuxt.config.ts
export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: { enabled: true },

  modules: [
    '@nuxtjs/color-mode',
    '@vueuse/nuxt',
    '@pinia/nuxt',
    '@nuxt/icon',
    '@nuxt/image',
    '@vite-pwa/nuxt',
    '@pinia-plugin-persistedstate/nuxt',
  ],

  vite: {
    plugins: [
      tailwindcss(),
    ],
  },

  colorMode: {
    classSuffix: '',
    preference: 'system',
    fallback: 'light',
    storageKey: 'sdd-color-mode',
    dataValue: 'theme',
  },

  pwa: {
    manifest: {
      name: 'Sanatana Dharma Digital',
      short_name: 'SDD',
      description: 'Platform Keagamaan Hindu Indonesia',
      theme_color: '#FF6B00',
      background_color: '#FFF8F0',
      display: 'standalone',
      orientation: 'portrait',
      start_url: '/',
      icons: [
        { src: '/icons/icon-192x192.png', sizes: '192x192', type: 'image/png' },
        { src: '/icons/icon-512x512.png', sizes: '512x512', type: 'image/png' },
        { src: '/icons/icon-512x512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' }
      ]
    },
    workbox: {
      globPatterns: ['**/*.{js,css,html,png,svg,ico,woff2}'],
      runtimeCaching: [
        {
          // Support regional Appwrite endpoints (e.g., fra.cloud.appwrite.io)
          urlPattern: /^https:\/\/.*\.appwrite\.io\/v1\/databases\/.*/i,
          handler: 'NetworkFirst',
          options: { 
            cacheName: 'appwrite-api-cache', 
            expiration: { maxEntries: 100, maxAgeSeconds: 86400 },
            cacheableResponse: { statuses: [0, 200] }
          }
        },
        {
          // EXCLUDE account/sessions from caching to prevent SW interference with auth
          urlPattern: /^https:\/\/.*\.appwrite\.io\/v1\/account\/.*/i,
          handler: 'NetworkOnly',
        }
      ]
    },
    client: { installPrompt: true },
    devOptions: { enabled: true, type: 'module' }
  },

  runtimeConfig: {
    public: {
      appwriteEndpoint: process.env.NUXT_PUBLIC_APPWRITE_ENDPOINT || 'https://cloud.appwrite.io/v1',
      appwriteProjectId: process.env.NUXT_PUBLIC_APPWRITE_PROJECT_ID || '',
      appwriteProjectName: process.env.NUXT_PUBLIC_APPWRITE_PROJECT_NAME || 'Sanatana Dharma Digital',
      appwriteDatabaseId: process.env.NUXT_PUBLIC_APPWRITE_DATABASE_ID || 'sanatana-dharma-db',
    }
  },

  app: {
    head: {
      title: 'Sanatana Dharma Digital',
      meta: [
        { name: 'viewport', content: 'width=device-width, initial-scale=1, viewport-fit=cover' },
        { name: 'theme-color', content: '#FF6B00' },
        { name: 'mobile-web-app-capable', content: 'yes' },
        { name: 'apple-mobile-web-app-status-bar-style', content: 'default' },
        { name: 'description', content: 'Platform Keagamaan Hindu Indonesia — Kalender Saka, Doa Mantra, Kitab Suci, dan lebih banyak lagi' }
      ],
      link: [
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Noto+Serif:ital,wght@0,400;0,600;0,700;1,400&family=Poppins:wght@300;400;500;600;700&display=swap' }
      ],
      script: [
        {
          src: '/theme-init.js',
          tagPosition: 'head',
          defer: true,
          async: false,
        }
      ]
    }
  },

  css: ['~/assets/css/main.css'],
})
