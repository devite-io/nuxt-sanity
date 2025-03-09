import { groq } from './groq'

export const IMAGE_ASSET_PROJECTION = groq`{
  _type,
  _id,
  url,
  altText,
  mimeType,
  originalFilename,
  metadata { lqip, dimensions }
}`

export const IMAGE_WITHOUT_PREVIEW_PROJECTION = groq`{
  _type,
  asset-> ${IMAGE_ASSET_PROJECTION.replace('lqip, ', '')},
}`

export const IMAGE_WITH_PREVIEW_PROJECTION = groq`{
  _type,
  asset-> ${IMAGE_ASSET_PROJECTION}
}`

export const LINK_PROJECTION = groq`{
  _type,
  _type == 'linkExternal' => { url, newWindow },
  _type == 'linkInternal' => { 'slug': '/' + coalesce(reference->slug.current, '') },
  linkTitle,
  relationship
}`
