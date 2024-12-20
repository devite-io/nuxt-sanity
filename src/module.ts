import crypto from 'node:crypto'
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

    const moduleConfig = defu(nuxt.options.runtimeConfig.public.sanity, {
      projectId: options.projectId,
      dataset: options.dataset || 'production',
      minimalClient: options.minimalClient || false,
      useCdn: options.useCdn || true,
      apiVersion: options.apiVersion || '2024-08-08',
      visualEditing: options.visualEditing || null,
    })

    /* Visual Editing */

    if (options.visualEditing) {
      const previewMode = moduleConfig.visualEditing.previewMode !== false
      const visualEditingConfig = defu(moduleConfig.visualEditing, {
        mode: 'live-visual-editing',
        previewMode: (previewMode
          ? defu(moduleConfig.visualEditing.previewMode, {
              enable: '/_sanity/preview/enable',
              disable: '/_sanity/preview/disable',
            })
          : false) as { enable: string, disable: string } | false,
        previewModeId: previewMode ? crypto.randomBytes(16).toString('hex') : '',
        proxyEndpoint: '/_sanity/fetch',
        stega: true,
        zIndex: 100,
        token: '',
      })

      if (!moduleConfig.visualEditing.token?.length)
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

      if (previewMode) {
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

      moduleConfig.visualEditing = visualEditingConfig
    }

    nuxt.options.runtimeConfig.sanity = moduleConfig
    nuxt.options.runtimeConfig.public.sanity = defu(nuxt.options.runtimeConfig.public.sanity, {
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
          && ({ enabled: true, studioUrl: moduleConfig.visualEditing.studioUrl } as StegaConfig))
        || {},
      visualEditing: moduleConfig.visualEditing,
    })

    /* Imports */

    addImportsDir(resolve('runtime/client'))
    addImportsDir(resolve('runtime/composables'))

    addImportsDir(resolve('runtime/utils/groq'))
    addImportsDir(resolve('runtime/utils/projections'))
    addImportsDir(resolve('runtime/utils/resolveImageAssetById'))
    addImportsDir(resolve('runtime/utils/resolveInternalLink'))

    /* Components */

    await addComponentsDir({ path: resolve('runtime/components') })
    await addComponentsDir({ path: '~/sanity', global: true, prefix: 'Sanity' })
  },
})
