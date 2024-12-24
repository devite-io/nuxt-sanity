import { joinURL } from 'ufo'
import type { ModuleOptions } from '@devite/nuxt-sanity'
import type { ImageModifiers, ProviderGetImage } from '@nuxt/image'
import { useRuntimeConfig } from '#imports'

const transformationMap = {
  'format': 'fm',
  'height': 'h',
  'quality': 'q',
  'width': 'w',
  'background': 'bg',
  'download': 'dl',
  'dpr': 'dpr',
  'sharpen': 'sharp',
  'orientation': 'or',
  'min-height': 'min-h',
  'max-height': 'max-h',
  'min-width': 'min-w',
  'max-width': 'max-w',
  'minHeight': 'min-h',
  'maxHeight': 'max-h',
  'minWidth': 'min-w',
  'maxWidth': 'max-w',
  'saturation': 'sat',
} as Record<string, string>

export function resolveSanityImageUrl(src: string, modifiers: Partial<ImageModifiers>): string {
  const matchResult = src.match(/-(?<width>\d*)x(?<height>\d*)-(?<format>.*)$/)

  if (!matchResult || !matchResult.groups) {
    throw new Error('Invalid image URL')
  }

  const sourceWidth = Number.parseInt(matchResult.groups.width)
  const sourceHeight = Number.parseInt(matchResult.groups.height)

  if (modifiers.crop && typeof modifiers.crop !== 'string' && sourceWidth && sourceHeight) {
    const left = modifiers.crop.left * sourceWidth
    const top = modifiers.crop.top * sourceHeight
    const right = sourceWidth - modifiers.crop.right * sourceWidth
    const bottom = sourceHeight - modifiers.crop.bottom * sourceHeight
    modifiers.rect = [left, top, right - left, bottom - top].map((i) => i.toFixed(0)).join(',')
    delete modifiers.crop
  }

  if (modifiers.hotspot && typeof modifiers.hotspot !== 'string') {
    modifiers['fp-x'] = modifiers.hotspot.x
    modifiers['fp-y'] = modifiers.hotspot.y

    delete modifiers.hotspot
  }

  if (!modifiers.format || modifiers.format === 'auto') {
    modifiers.auto = 'format'
  }

  if (modifiers.fit === 'contain' && !modifiers.bg)
    modifiers.bg = 'ffffff'

  const operations = Object.keys(modifiers).map((key) => {
    const operationKey = transformationMap[key] || key
    let value = modifiers[key]

    if (operationKey === 'fm' && value === 'jpeg')
      value = 'jpg'

    if (operationKey === 'fit') {
      if (value === 'cover')
        value = 'crop'
      else if (value === 'contain')
        value = 'fill'
      else if (value === 'fill')
        value = 'scale'
      else if (value === 'inside')
        value = 'min'
      else if (value === 'outside')
        value = 'max'
    }

    if (value === true)
      return operationKey

    return `${operationKey}=${value}`
  }).join('&')
  const parts = src.split('-').slice(1)
  const format = parts.pop()
  const filenameAndQueries = parts.join('-') + '.' + format + (operations ? ('?' + operations) : '')

  const sanityConfig = useRuntimeConfig().public.sanity as ModuleOptions

  return joinURL('https://cdn.sanity.io/images', sanityConfig.projectId, sanityConfig.dataset, filenameAndQueries)
}

export const getImage: ProviderGetImage = (
  src,
  { modifiers = {} } = {},
): { url: string } => {
  const minimalClientConfig = (useRuntimeConfig().public.sanity as ModuleOptions).minimalClient
  const useCaching = typeof minimalClientConfig === 'object' && minimalClientConfig.cachingEnabled

  if (useCaching && minimalClientConfig.cacheBaseUrl) {
    const params = new URLSearchParams()
    params.set('src', src)
    params.set('modifiers', JSON.stringify(modifiers))

    return { url: joinURL(minimalClientConfig.cacheBaseUrl, minimalClientConfig.assetEndpoint + `?${params.toString()}`) }
  }

  return { url: resolveSanityImageUrl(src, modifiers) }
}
