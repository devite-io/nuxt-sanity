import type { SanityArray, SanityModule, SEO } from '..'

export interface NotFound {
  _type: 'notFound'
  modules: SanityArray<SanityModule>
  seo: SEO
}
