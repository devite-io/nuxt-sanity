import { randomBytes } from 'node:crypto'
import {
  addComponentsDir,
  addImportsDir,
  addPlugin,
  addServerHandler,
  createResolver,
  defineNuxtModule,
} from '@nuxt/kit'
import defu from 'defu'
import type { StegaConfig } from '@sanity/client'
import { name, version } from '../package.json'
import type { ModuleOptions } from './types/ModuleOptions'

export * from './types/sanity'
export * from './types/ModuleOptions'

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name,
    version,
    configKey: 'sanity',
  },
  defaults: {},
  async setup(options, nuxt) {
    const { resolve } = createResolver(import.meta.url)

    /* Config validation */

    const sanityRuntimeConfig = defu(nuxt.options.runtimeConfig.sanity || {}, {
      projectId: options.projectId,
      dataset: options.dataset || 'production',
      minimalClient: options.minimalClient || false,
      useCdn: options.useCdn || true,
      apiVersion: options.apiVersion || '2024-08-08',
      visualEditing: options.visualEditing || null,
    })

    /* Visual Editing */

    if (sanityRuntimeConfig.visualEditing) {
      const visualEditingConfig = defu(sanityRuntimeConfig.visualEditing, {
        mode: 'live-visual-editing',
        previewMode: (sanityRuntimeConfig.visualEditing.previewMode !== false
          ? defu(sanityRuntimeConfig.visualEditing.previewMode, {
              enable: '/_sanity/preview/enable',
              disable: '/_sanity/preview/disable',
            })
          : false) as { enable: string, disable: string } | false,
        proxyEndpoint: '/_sanity/fetch',
        stega: true,
        zIndex: 100,
      })

      sanityRuntimeConfig.visualEditing = defu(
        sanityRuntimeConfig.visualEditing,
        visualEditingConfig && {
          previewModeId: visualEditingConfig.previewMode ? randomBytes(16).toString('hex') : '',
          token: sanityRuntimeConfig.visualEditing.token || '',
        },
      )

      if (!sanityRuntimeConfig.visualEditing.token?.length)
        console.warn('Visual editing requires a token with "read" access')

      if (!visualEditingConfig.studioUrl) console.warn('Visual editing requires a studio URL')

      if (visualEditingConfig.mode === 'live-visual-editing' && !visualEditingConfig.stega)
        console.warn('Visual Editing requires "stega" to be enabled in "live-visual-editing" mode')

      nuxt.options.build.transpile.push(
        'async-cache-dedupe',
        '@sanity/core-loader',
        '@sanity/preview-url-secret',
      )
      nuxt.options.vite.resolve = defu(nuxt.options.vite.resolve, {
        dedupe: ['@sanity/client'],
      })
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
          route: visualEditingConfig.previewMode.enable,
          handler: resolve('runtime/server/routes/preview/enable'),
        })
        addServerHandler({
          method: 'get',
          route: visualEditingConfig.previewMode.disable,
          handler: resolve('runtime/server/routes/preview/disable'),
        })
      }

      addServerHandler({
        method: 'post',
        route: visualEditingConfig.proxyEndpoint,
        handler: resolve('runtime/server/routes/proxy'),
      })
    }

    nuxt.options.runtimeConfig.sanity = sanityRuntimeConfig
    nuxt.options.runtimeConfig.public.sanity = {
      projectId: sanityRuntimeConfig.projectId,
      dataset: sanityRuntimeConfig.dataset,
      minimalClient: sanityRuntimeConfig.minimalClient,
      useCdn: sanityRuntimeConfig.useCdn,
      apiVersion: sanityRuntimeConfig.apiVersion,
      perspective: 'raw',
      /* Visual Editing */
      visualEditing: sanityRuntimeConfig.visualEditing,
      token: null,
      withCredentials: false,
      stega:
        (options.visualEditing
          && options.visualEditing.stega !== false
          && options.visualEditing.previewMode !== false
          && ({ enabled: true, studioUrl: options.visualEditing.studioUrl } as StegaConfig))
        || {},
    }

    /* Imports */

    addImportsDir(resolve('runtime/client'))
    addImportsDir(resolve('runtime/utils'))
    addImportsDir(resolve('runtime/composables'))

    /* Components */

    await addComponentsDir({ path: resolve('runtime/components') })
    await addComponentsDir({ path: '~/sanity', global: true, prefix: 'Sanity' })
  },
})
