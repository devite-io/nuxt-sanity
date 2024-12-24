import type { ClientPerspective, StegaConfig } from '@sanity/client'
import type { SanityVisualEditingMode } from './src/module'
import type { SanityVisualEditingRefreshHandler } from './src/types/ModuleOptions'

declare module 'nuxt/schema' {
  interface RuntimeConfig {
    sanity: {
      visualEditing?: {
        mode: SanityVisualEditingMode
        previewModeId: string
        previewMode: false | { enableEndpoint: string, disableEndpoint: string }
        proxyEndpoint: string
        studioUrl: string
        token: string
      }
    }
  }

  interface PublicRuntimeConfig {
    sanity: {
      projectId: string
      dataset: string
      useCdn: boolean
      apiVersion: string
      perspective: ClientPerspective
      token: string
      withCredentials: boolean
      stega: StegaConfig
      visualEditing?: {
        mode: SanityVisualEditingMode
        previewMode: false | { enableEndpoint: string, disableEndpoint: string }
        proxyEndpoint: string
        refresh: SanityVisualEditingRefreshHandler
        studioUrl: string
        zIndex: number
      } | null
    }
  }
}

export {}
