import type { Slug } from '@sanity/types'
import type { SEO } from '../objects/SEO'

export interface Page {
  _id: string
  _type: 'page'
  title: string
  slug: Slug
  modules: Array<object>
  seo: SEO
}
