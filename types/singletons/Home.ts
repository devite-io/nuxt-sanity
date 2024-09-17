import type { SEO } from '~/types/sanity/objects/SEO'

export interface Home {
  _type: 'home'
  modules: Array<object>
  seo: SEO
}
