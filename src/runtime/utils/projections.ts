import { groq } from '@nuxtjs/sanity/runtime/groq'

export const PICTURE_PROJECTION = groq`{
  _type,
  asset-> {
    _type,
    _id,
    url,
    altText,
    mimeType,
    metadata { dimensions }
  }
}`

export const IMAGE_PROJECTION = groq`{
  _type,
  asset-> {
    _type,
    _id,
    url,
    altText,
    mimeType,
    metadata { lqip, dimensions }
  }
}`
