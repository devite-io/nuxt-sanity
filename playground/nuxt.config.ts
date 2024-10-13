export default defineNuxtConfig({
  devtools: { enabled: false },

  // modules
  modules: ['@nuxtjs/sanity', '@nuxt/image', '../src/module'],
  image: {
    provider: 'sanity',
    screens: {
      'xs': 320,
      'sm': 640,
      'md': 768,
      'lg': 1024,
      'xl': 1280,
      '2xl': 1536,
    },
    sanity: {
      projectId: 'v797kwt3',
      dataset: 'production',
    },
  },
  sanity: {
    minimal: process.env.NUXT_SANITY_MINIMAL === 'true',
    visualEditing: {
      studioUrl: process.env.NUXT_SANITY_STUDIO_URL,
      token: process.env.NUXT_SANITY_READ_TOKEN,
    },
    apiVersion: '2024-08-08',
  },

  // runtime config
  runtimeConfig: {
    public: {
      baseURL: 'http://localhost:3000',
    },
  },

  // auto-imports for types
  imports: {
    dirs: ['types/**/*.ts'],
  },

  // server
  nitro: {
    prerender: {
      routes: ['/'],
      crawlLinks: true,
      failOnError: false,
    },
  },

  compatibilityDate: '2024-09-17',
})
