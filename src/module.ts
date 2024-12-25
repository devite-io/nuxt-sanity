import crypto from 'node:crypto'
import {
  addComponentsDir,
  addImports,
  addImportsDir,
  addPlugin,
  addServerHandler,
  createResolver,
  defineNuxtModule, installModule,
} from '@nuxt/kit'
import defu from 'defu'
import type { StegaConfig } from '@sanity/client'
import { name, version } from '../package.json'
import type { ModuleOptions, SanityVisualEditingMode } from './types/ModuleOptions'

export * from './types/sanity'
export * from './types/ModuleOptions'

const CONFIG_KEY = 'sanity'

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name,
    version,
    configKey: CONFIG_KEY,
  },
  defaults: {},
  async setup(options, nuxt) {
    const { resolve } = createResolver(import.meta.url)
    const $config = nuxt.options.runtimeConfig

    /* Config validation */

    const moduleConfig = {
      projectId: options.projectId,
      dataset: options.dataset || 'production',
      minimalClient:
        (options.minimalClient !== false
          ? defu(options.minimalClient, {
              cachingEnabled: true,
              cacheClientBaseUrl: 'http://localhost:3000',
              cacheServerBaseUrl: 'http://localhost:3000',
              assetEndpoint: '/_sanity/cache/asset',
              queryEndpoint: '/_sanity/cache/query',
              webhookEndpoint: '/_sanity/cache/invalidate',
            })
          : false) as ({ cachingEnabled: boolean, cacheBaseUrl: string, assetEndpoint: string, queryEndpoint: string, webhookEndpoint: string, webhookSecret?: string } | false),
      useCdn: options.useCdn || true,
      apiVersion: options.apiVersion || '2024-08-08',
      visualEditing: options.visualEditing || null,
    }

    nuxt.options.build.transpile.push('@sanity/core-loader')

    /* Visual Editing */

    if (moduleConfig.visualEditing) {
      const previewMode = moduleConfig.visualEditing.previewMode !== false
      const visualEditingConfig = defu(moduleConfig.visualEditing, {
        mode: 'live-visual-editing' as SanityVisualEditingMode,
        previewMode: (previewMode
          ? defu(moduleConfig.visualEditing.previewMode, {
              enableEndpoint: '/_sanity/preview/enable',
              disableEndpoint: '/_sanity/preview/disable',
            })
          : false) as ({ enableEndpoint: string, disableEndpoint: string } | false),
        proxyEndpoint: '/_sanity/fetch',
        stega: true,
        zIndex: 100,
      })

      if (!moduleConfig.visualEditing.token?.length)
        console.warn('Visual editing requires a token with "read" access')

      if (!visualEditingConfig.studioUrl)
        console.warn('Visual editing requires a studio URL')

      if (visualEditingConfig.mode === 'live-visual-editing' && !visualEditingConfig.stega)
        console.warn('Visual Editing requires "stega" to be enabled in "live-visual-editing" mode')

      nuxt.options.build.transpile.push('@sanity/preview-url-secret', 'async-cache-dedupe')
      nuxt.options.vite.resolve = defu(nuxt.options.vite.resolve, { dedupe: ['@sanity/client'] })
      nuxt.options.vite.optimizeDeps = defu(nuxt.options.vite.optimizeDeps, {
        include: [
          `${name} > @sanity/visual-editing > @sanity/mutate > lodash/groupBy.js`,
          `${name} > @sanity/visual-editing > react`,
          `${name} > @sanity/visual-editing > react/jsx-runtime`,
          `${name} > @sanity/visual-editing > react-dom`,
          `${name} > @sanity/visual-editing > react-dom/client`,
          `${name} > @sanity/visual-editing > react-compiler-runtime`,
          '@sanity/client',
        ],
      })

      addPlugin({ src: resolve('runtime/plugins/visual-editing') })

      if (typeof visualEditingConfig.previewMode === 'object') {
        addServerHandler({
          method: 'get',
          route: visualEditingConfig.previewMode.enableEndpoint,
          handler: resolve('runtime/server/routes/preview/enable'),
        })
        addServerHandler({
          method: 'get',
          route: visualEditingConfig.previewMode.disableEndpoint,
          handler: resolve('runtime/server/routes/preview/disable'),
        })
      }

      addServerHandler({
        method: 'post',
        route: visualEditingConfig.proxyEndpoint,
        handler: resolve('runtime/server/routes/proxy'),
      })

      moduleConfig.visualEditing = visualEditingConfig
    }

    if (typeof moduleConfig.minimalClient === 'object' && moduleConfig.minimalClient.cachingEnabled) {
      nuxt.options.nitro.storage ||= {}
      nuxt.options.nitro.storage.sanityDocumentDeps = {
        driver: 'fsLite',
        base: '.tmp/sanityDocumentDeps',
      }
      nuxt.options.nitro.storage.sanityData = {
        driver: 'fsLite',
        base: '.tmp/sanityData',
      }

      addServerHandler({
        method: 'get',
        route: moduleConfig.minimalClient.assetEndpoint,
        handler: resolve('runtime/server/routes/cache/asset'),
      })
      addServerHandler({
        method: 'get',
        route: moduleConfig.minimalClient.queryEndpoint,
        handler: resolve('runtime/server/routes/cache/query'),
      })

      if (moduleConfig.minimalClient.webhookSecret) {
        addServerHandler({
          method: 'delete',
          route: moduleConfig.minimalClient.webhookEndpoint,
          handler: resolve('runtime/server/routes/cache/webhook'),
        })
      }
      else {
        console.warn('Webhook secret is required for webhook-based cache invalidation')
      }
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    $config.sanity = defu($config.sanity as any, {
      visualEditing: moduleConfig.visualEditing && {
        ...moduleConfig.visualEditing,
        previewModeId: moduleConfig.visualEditing!.previewMode
          ? crypto.randomBytes(16).toString('hex')
          : '',
        token: moduleConfig.visualEditing.token || '',
      },
      webhookSecret: (moduleConfig.minimalClient && moduleConfig.minimalClient.webhookSecret) || undefined,
    })

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    $config.public.sanity = defu($config.public.sanity as any, {
      projectId: moduleConfig.projectId,
      dataset: moduleConfig.dataset,
      minimalClient: moduleConfig.minimalClient,
      useCdn: moduleConfig.useCdn,
      apiVersion: moduleConfig.apiVersion,
      perspective: 'raw',
      /* Visual Editing */
      token: options.token || '',
      withCredentials: options.withCredentials || false,
      stega:
          (moduleConfig.visualEditing
            && moduleConfig.visualEditing.stega !== false
            && moduleConfig.visualEditing.previewMode !== false
            && ({
              enabled: true,
              studioUrl: moduleConfig.visualEditing.studioUrl,
            } as StegaConfig))
            || {},
      visualEditing: moduleConfig.visualEditing,
    })

    /* Imports */

    addImportsDir(resolve('runtime/client'))
    addImports([
      // composables
      { name: 'useSanityQuery', from: resolve('runtime/composables/useSanityQuery') },
      { name: 'useLazySanityQuery', from: resolve('runtime/composables/useLazySanityQuery') },

      // helper methods
      { name: 'groq', from: resolve('runtime/utils/groq') },
      { name: 'resolveImageAssetById', from: resolve('runtime/utils/resolveImageAssetById') },
      { name: 'resolveInternalLink', from: resolve('runtime/utils/resolveInternalLink') },

      // projections
      ...[
        'IMAGE_ASSET_PROJECTION',
        'IMAGE_WITHOUT_PREVIEW_PROJECTION',
        'IMAGE_WITH_PREVIEW_PROJECTION',
        'LINK_PROJECTION',
      ].map((field) => ({
        name: field,
        from: resolve('runtime/utils/projections'),
      }))],
    )

    /* Components */

    await addComponentsDir({ path: resolve('runtime/components') })
    await addComponentsDir({
      path: '~/sanity',
      global: true,
      prefix: 'Sanity',
      pathPrefix: false,
    })

    /* @nuxt/image provider */

    await installModule('@nuxt/image', {
      providers: {
        cachedSanity: {
          provider: resolve('runtime/imageProviders/sanity'),
        },
      },
    }, nuxt)
  },
})
