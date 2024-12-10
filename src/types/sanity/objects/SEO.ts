import type { ImageAsset } from '@sanity/types'

export interface SEO {
  _type: 'seo'
  indexable: boolean
  title: string
  shortTitle: string
  description: string
  image?: { asset: ImageAsset }
}
