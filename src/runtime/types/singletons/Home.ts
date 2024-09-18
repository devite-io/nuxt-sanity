import type { SEO } from '../objects/SEO'

export interface Home {
  _type: 'home'
  modules: Array<object>
  seo: SEO
}
