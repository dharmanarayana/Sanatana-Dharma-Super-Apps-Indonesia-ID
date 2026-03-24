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
    '@nuxtjs/i18n',
  ],

  i18n: {
    langDir: 'locales',
    defaultLocale: 'id',
    strategy: 'no_prefix',
    locales: [
      { code: 'id', name: 'Bahasa Indonesia', file: 'id.json' },
      { code: 'en', name: 'English', file: 'en.json' },
      { code: 'bali', name: 'Basa Bali', file: 'bali.json' }
    ],
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: 'i18n_redirected',
      alwaysRedirect: true,
      fallbackLocale: 'id'
    }
  },

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
      navigateFallback: '/',
      globPatterns: ['**/*.{js,css,html,png,svg,ico,woff2,json}'],
      cleanupOutdatedCaches: true,
      clientsClaim: true,
      skipWaiting: true,
      runtimeCaching: [
        {
          urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
          handler: 'CacheFirst',
          options: {
            cacheName: 'google-fonts-stylesheets',
            expiration: { maxEntries: 10, maxAgeSeconds: 60 * 60 * 24 * 365 }
          }
        },
        {
          urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
          handler: 'CacheFirst',
          options: {
            cacheName: 'google-fonts-webfonts',
            expiration: { maxEntries: 30, maxAgeSeconds: 60 * 60 * 24 * 365 }
          }
        },
        {
          urlPattern: ({ request }) => request.mode === 'navigate',
          handler: 'NetworkFirst',
          options: {
            cacheName: 'pages-cache',
            expiration: { maxEntries: 50, maxAgeSeconds: 86400 }
          }
        },
        {
          urlPattern: /^https:\/\/.*\.appwrite\.io\/v1\/databases\/.*/i,
          handler: 'NetworkFirst',
          options: { 
            cacheName: 'appwrite-api-cache', 
            expiration: { maxEntries: 100, maxAgeSeconds: 86400 }
          }
        }
      ]
    },
    injectRegister: 'inline',
    client: { 
      installPrompt: true,
      periodicSyncForUpdates: 3600
    },
    devOptions: { 
      enabled: true, 
      type: 'module',
      navigateFallback: '/'
    }
  },

  runtimeConfig: {
    public: {
      // Improved fallbacks for different variable naming conventions on Vercel
      appwriteEndpoint: process.env.NUXT_PUBLIC_APPWRITE_ENDPOINT || process.env.APPWRITE_ENDPOINT || 'https://fra.cloud.appwrite.io/v1',
      appwriteProjectId: process.env.NUXT_PUBLIC_APPWRITE_PROJECT_ID || process.env.APPWRITE_PROJECT_ID || '',
      appwriteProjectName: process.env.NUXT_PUBLIC_APPWRITE_PROJECT_NAME || 'Sanatana Dharma Digital',
      appwriteDatabaseId: process.env.NUXT_PUBLIC_APPWRITE_DATABASE_ID || 'sanatana-dharma-db',
    }
  },

  app: {
    head: {
      title: 'Sanatana Dharma Digital',
      titleTemplate: '%s | Sanatana Dharma Digital',
      htmlAttrs: {
        lang: 'id'
      },
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1, viewport-fit=cover' },
        { name: 'theme-color', content: '#FF6B00' },
        { name: 'format-detection', content: 'telephone=no' },
        { name: 'apple-mobile-web-app-capable', content: 'yes' },
        { name: 'apple-mobile-web-app-status-bar-style', content: 'default' },
        { name: 'apple-mobile-web-app-title', content: 'Sanatana Dharma' },
        { name: 'description', content: 'Platform Keagamaan Hindu Indonesia — Kalender Saka, Doa Mantra, Kitab Suci, dan lebih banyak lagi' },
        // SEO Open Graph
        { property: 'og:type', content: 'website' },
        { property: 'og:site_name', content: 'Sanatana Dharma Digital' },
        { property: 'og:title', content: 'Sanatana Dharma Digital' },
        { property: 'og:description', content: 'Platform Keagamaan Hindu Indonesia — Kalender Saka, Doa Mantra, Kitab Suci, dan lebih banyak lagi' },
        { property: 'og:image', content: '/og-image.png' },
        { property: 'og:image:width', content: '1200' },
        { property: 'og:image:height', content: '630' },
        // Twitter
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:title', content: 'Sanatana Dharma Digital' },
        { name: 'twitter:description', content: 'Platform Keagamaan Hindu Indonesia — Kalender Saka, Doa Mantra, Kitab Suci, dan lebih banyak lagi' },
        { name: 'twitter:image', content: '/og-image.png' }
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
        { rel: 'apple-touch-icon', href: '/icons/icon-192x192.png' },
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
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
  
  nitro: {
    compressPublicAssets: true,
    prerender: {
      routes: ['/', '/_offline']
    }
  }
})
