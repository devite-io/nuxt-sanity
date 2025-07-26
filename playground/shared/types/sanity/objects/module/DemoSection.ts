import type { RichText } from '@devite/nuxt-sanity'

export interface DemoSection {
  _type: 'demoSection'
  headline: string
  paragraph: RichText
  image: ImageBlock
}
