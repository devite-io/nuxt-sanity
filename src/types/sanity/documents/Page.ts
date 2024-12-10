import type { Slug } from '@sanity/types'
import type { SanityArray, SanityModule, SEO } from '..'

export interface Page {
  _id: string
  _type: 'page'
  title: string
  slug: Slug
  modules: SanityArray<SanityModule>
  seo: SEO
}
