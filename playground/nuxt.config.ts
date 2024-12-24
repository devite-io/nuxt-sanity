export default defineNuxtConfig({
  modules: ['../src/module', '@nuxt/image'],

  imports: {
    dirs: ['types/**/*.ts'], // auto-imports for types
  },

  runtimeConfig: {
    public: {
      baseURL: 'http://localhost:3000',
    },
  },

  ignore: ['cms'], // ignore Sanity Studio directory

  compatibilityDate: '2024-09-17',

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
      projectId: process.env.NUXT_SANITY_PROJECT_ID,
      dataset: process.env.NUXT_SANITY_DATASET,
    },
  },

  sanity: {
    projectId: process.env.NUXT_SANITY_PROJECT_ID,
    dataset: process.env.NUXT_SANITY_DATASET,
    minimalClient: {
      webhookSecret: process.env.NUXT_SANITY_WEBHOOK_SECRET,
    },
    visualEditing: {
      mode: 'live-visual-editing',
      studioUrl: process.env.NUXT_SANITY_STUDIO_URL,
      token: process.env.NUXT_SANITY_READ_TOKEN,
    },
    apiVersion: '2024-08-08',
  },
})
