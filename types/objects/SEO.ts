import type { Image } from '@sanity/types'

export interface SEO {
  _type: 'seo'
  indexable: boolean
  title: string
  opengraph_title: string
  description: string
  image?: Image
}
