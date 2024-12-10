import type { HistoryRefresh, VisualEditingOptions as SanityVisualEditingOptions } from '@sanity/visual-editing'

export interface ModuleOptions {
  projectId: string
  /** @default 'production' */
  dataset: string
  /** @default false */
  minimalClient?: boolean
  /** @default true */
  useCdn?: boolean
  /** @default '2024-08-08' */
  apiVersion?: string
  visualEditing?: VisualEditingOptions
}

export interface VisualEditingOptions {
  /** @default { enable: "/_sanity/preview/enable", disable: "/_sanity/preview/disable" } */
  previewMode?: boolean | { enable?: string, disable?: string }
  previewModeId?: string
  /** @default 'live-visual-editing' */
  mode?: 'live-visual-editing' | 'visual-editing' | 'custom'
  /** @default '/_sanity/fetch' */
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

export type SanityVisualEditingRefreshHandler = (
  payload: HistoryRefresh,
  refreshDefault: () => false | Promise<void>,
) => false | Promise<void>
