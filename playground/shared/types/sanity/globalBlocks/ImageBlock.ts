import type { Image } from '@sanity/types'

export interface ImageBlock {
  _type: 'imageBlock'
  image?: Image
  lazy: boolean
}
