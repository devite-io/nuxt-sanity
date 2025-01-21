import type { ImageAsset } from '@sanity/types'

export interface SEO {
  _type: 'seo'
  indexable: boolean
  priority: number
  changeFreq: 'always' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never'
  title: string
  shortTitle: string
  description: string
  image?: { asset: ImageAsset }
}
