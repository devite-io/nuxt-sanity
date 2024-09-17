import type { SEO } from '~/types/sanity/objects/SEO'

export interface NotFound {
  _type: 'notFound'
  modules: Array<object>
  seo: SEO
}
