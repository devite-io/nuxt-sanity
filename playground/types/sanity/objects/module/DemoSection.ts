import type { RichText } from '#module-types/richText/RichText'

export interface DemoSection {
  _type: 'demoSection'
  headline: string
  paragraph: RichText
  image: ImageBlock
}
