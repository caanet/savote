// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: { enabled: true },

  nitro: {
    preset: "cloudflare-pages",
    routeRules: {
      '/api/**': {
        cors: true,
        headers: {
          'Access-Control-Allow-Origin': '*'
        }
      }
    },
    storage: {
      'redis': {
        driver: 'redis',
        /* redis connector options */
      },
      'fs': {
        driver: 'fs',
        base: './.data/cache'
      }
    }
  },

  modules: ["nitro-cloudflare-dev"],

  app: {
    head: {
      link: [
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap'
        }
      ]
    }
  },

  css: ['~/assets/css/main.css'],
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },
})