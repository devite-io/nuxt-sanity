import type { SanityArray, SanityModule, SEO } from '..'

export interface Home {
  _type: 'home'
  modules: SanityArray<SanityModule>
  seo: SEO
}
