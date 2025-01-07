import { validatePreviewUrl } from '@sanity/preview-url-secret'
import { createError, defineEventHandler, getRequestURL, sendRedirect, setCookie } from 'h3'
import useSanityClient from '../../utils/useSanityClient'
import type DefaultSanityClient from '../../../client/DefaultSanityClient'
import { useRuntimeConfig } from '#imports'

export default defineEventHandler(async (event) => {
  const client = useSanityClient('default') as DefaultSanityClient

  const { isValid, redirectTo = '/' } = await validatePreviewUrl(client.client, getRequestURL(event).toString())

  if (!isValid) {
    return createError({
      statusCode: 403,
      statusMessage: 'Invalid secret',
    })
  }

  const secure = (useRuntimeConfig().public.baseUrl as string | undefined)?.startsWith('https://') || false

  setCookie(event, '__sanity_preview', client.config.visualEditing!.previewModeId || '', {
    httpOnly: true,
    sameSite: secure ? 'none' : 'lax',
    secure,
    path: '/',
  })

  await sendRedirect(event, redirectTo, 307)
})
