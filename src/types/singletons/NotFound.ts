import type { SEO } from '../objects/SEO'

export interface NotFound {
  _type: 'notFound'
  modules: Array<object>
  seo: SEO
}
