import type {
  HistoryRefresh,
  VisualEditingOptions as SanityVisualEditingOptions,
} from '@sanity/visual-editing'
import type { ClientConfig } from '@sanity/client'

export type ModuleOptions = ClientConfig & {
  projectId: string
  /** @default "production" */
  dataset: string
  /** @default { cachingEnabled: true, cacheBaseUrl: "http://localhost:3000", assetEndpoint: "/_sanity/cache/asset", queryEndpoint: "/_sanity/cache/query", webhookEndpoint: "/_sanity/cache/invalidate" } */
  minimalClient?: boolean | {
    cachingEnabled?: boolean
    cacheBaseUrl?: string
    assetEndpoint?: string
    queryEndpoint?: string
    webhookEndpoint?: string
    webhookSecret?: string
  }
  /** @default true */
  useCdn?: boolean
  /** @default "2024-08-08" */
  apiVersion?: string
  visualEditing?: VisualEditingOptions
}

export interface VisualEditingOptions {
  /** @default { enableEndpoint: "/_sanity/preview/enable", disableEndpoint: "/_sanity/preview/disable" } */
  previewMode?: boolean | { enableEndpoint?: string, disableEndpoint?: string }
  previewModeId?: string
  /** @default "live-visual-editing" */
  mode?: SanityVisualEditingMode
  /** @default "/_sanity/fetch" */
  proxyEndpoint?: string
  token?: string
  studioUrl?: string
  /** @default true */
  stega?: boolean
  /** This function is only required if `mode` is set to 'visual-editing' */
  refresh?: SanityVisualEditingRefreshHandler
  /** @default 100 */
  zIndex?: SanityVisualEditingOptions['zIndex']
}

export type SanityVisualEditingMode = 'live-visual-editing' | 'visual-editing' | 'custom'

export type SanityVisualEditingRefreshHandler = (
  payload: HistoryRefresh,
  refreshDefault: () => false | Promise<void>
) => false | Promise<void>
