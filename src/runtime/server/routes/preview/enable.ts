import { validatePreviewUrl } from '@sanity/preview-url-secret'
import { createError, defineEventHandler, getRequestURL, sendRedirect, setCookie } from 'h3'
import useSanityClient from '../../../utils/useSanityClient'
import type DefaultSanityClient from '../../../client/DefaultSanityClient'

export default defineEventHandler(async (event) => {
  const client = useSanityClient('default') as DefaultSanityClient

  const { isValid, redirectTo = '/' } = await validatePreviewUrl(client.client, getRequestURL(event).toString())

  if (!isValid) {
    return createError({
      statusCode: 403,
      statusMessage: 'Invalid secret',
    })
  }

  setCookie(event, '__sanity_preview', client.config.visualEditing!.previewModeId || '', {
    httpOnly: true,
    sameSite: !import.meta.dev ? 'none' : 'lax',
    secure: !import.meta.dev,
    path: '/',
  })

  await sendRedirect(event, redirectTo, 307)
})
