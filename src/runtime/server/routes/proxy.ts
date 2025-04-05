import { createError, defineEventHandler, getCookie, readBody } from 'h3'
import useSanityClient from '../utils/useSanityClient'
import type DefaultSanityClient from '../../client/DefaultSanityClient'

export default defineEventHandler(async (event) => {
  const previewModeCookie = getCookie(event, '__sanity_preview')

  if (!previewModeCookie) {
    return createError({
      statusCode: 403,
      statusMessage: 'This route is only available in preview mode',
    })
  }

  const { query, params = {}, options } = await readBody(event)

  if (!query) {
    return createError({
      statusCode: 400,
      statusMessage: `Field "query" is required`,
    })
  }

  return (await useSanityClient('default') as DefaultSanityClient).fetch(
    query, params, options ?? undefined,
  )
})
