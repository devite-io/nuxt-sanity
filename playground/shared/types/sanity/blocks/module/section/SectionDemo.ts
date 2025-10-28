import type { RichText } from '@devite/nuxt-sanity'

export interface SectionDemo {
  _type: 'sectionDemo'
  headline: string
  paragraph: RichText
  image: ImageBlock
}
